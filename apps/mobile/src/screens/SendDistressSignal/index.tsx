import {
  AppButton,
  BackButton,
  ChipGroup,
  Notification,
  SearchInput,
  Txt,
} from '@components';
import {CURRENT_LOCATION, types} from '@constants';
import {ERole, EScreen} from '@enums';
import {
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {memo, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {getAsyncStorage, requestLocationPermission} from '@utils';
import {newIdempotencyKey, useMessages} from '@features/rescue';
import {PLACE_LABEL, PlaceKind, useSavedPlaces} from '@features/profile';

import {Context} from '@context';
import {Location} from '@types';
import {RootParamList} from '@navigation/RootNavigation';
import {RootScreenNavigationProps} from '@navigation';
import {tokens} from '@theme';

const {colors, space, radius} = tokens;

type ConfirmRoute = RouteProp<RootParamList, EScreen.SEND_DISTRESS_SIGNAL>;

// Firestore never rejects a write while offline, it only queues it.
const SEND_TIMEOUT_MS = 15000;

// Short chip labels; the values stay the strings the API mapping expects.
const LABELS: Record<string, string> = {
  'Rescue request': 'Breakdown',
  'Traffic incident report': 'Accident',
  'Road issue report': 'Road hazard',
  'Replacement vehicle request': 'Need a vehicle',
  'Emergency support request': 'Medical',
};
const TYPE_OPTIONS = types.map(t => ({value: t, label: LABELS[t] ?? t}));

const SendDistressSignal = () => {
  const {reset, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.SEND_DISTRESS_SIGNAL>>();
  const params = useRoute<ConfirmRoute>().params;
  const {onNew: onNewFromHook} = useMessages();
  const onNew = params?.onNew ?? onNewFromHook;

  const {currentUser} = useContext(Context);

  // Fixed per form, so sending again after a timeout cannot create a duplicate.
  const requestId = useRef(newIdempotencyKey());

  const {places} = useSavedPlaces();
  const placeOptions = (Object.keys(places) as PlaceKind[]).map(kind => ({
    value: kind,
    label: PLACE_LABEL[kind],
  }));

  const [location, setLocation] = useState<Location | null>(null);
  const [editingLocation, setEditingLocation] = useState(false);
  const [type, setType] = useState(types[0]);
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const setup = async () => {
      await (currentUser?.role === ERole.WORKER
        ? requestLocationPermission(1)
        : requestLocationPermission());
      const cache = await getAsyncStorage<Location>(CURRENT_LOCATION);
      cache && setLocation(cache);
    };
    setup();
  }, [currentUser]);

  const handleSearch = useCallback(async (picked: Location) => {
    setLocation(picked);
    setEditingLocation(false);
  }, []);

  const send = useCallback(async () => {
    if (!location) {
      setError('Choose your location so the rescue team can find you.');
      return;
    }
    if (!currentUser) {
      return;
    }
    Keyboard.dismiss();
    setSending(true);
    setError(undefined);
    try {
      await Promise.race([
        onNew({
          id: requestId.current,
          type,
          description,
          location,
          status: 'pending',
          time: Date.now(),
          userID: currentUser.id,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), SEND_TIMEOUT_MS),
        ),
      ]);
      reset({routes: [{name: EScreen.DRAWER}], index: 0});
    } catch (e: any) {
      setError(
        e?.message && e.message !== 'timeout'
          ? e.message
          : 'Your request was not confirmed. Check your connection and send again.',
      );
    }
    setSending(false);
  }, [location, currentUser, onNew, type, description, reset]);

  const sections = (
    <>
          <View style={styles.section}>
            <Txt variant="label" color={colors.textMuted}>
              Where are you?
            </Txt>
            {editingLocation ? (
              <View style={styles.searchBox}>
                <SearchInput
                  region={location}
                  onSearch={handleSearch}
                  placeholder="Search an address"
                  field="location"
                  zIndex={4}
                />
              </View>
            ) : (
              <View style={styles.card}>
                <View style={styles.flex}>
                  <Txt variant="body" numberOfLines={2}>
                    {location
                      ? location.description || 'Current GPS position'
                      : 'Finding your location…'}
                  </Txt>
                  {location?.accuracy ? (
                    <Txt variant="caption" color={colors.textMuted}>
                      Accurate to about {Math.round(location.accuracy)} m
                    </Txt>
                  ) : null}
                </View>
                <AppButton
                  label="Change"
                  variant="ghost"
                  onPress={() => setEditingLocation(true)}
                />
              </View>
            )}
            {!editingLocation && placeOptions.length > 0 && (
              <ChipGroup
                options={placeOptions}
                value={
                  placeOptions.find(
                    o =>
                      places[o.value]?.latitude === location?.latitude &&
                      places[o.value]?.longitude === location?.longitude,
                  )?.value ?? ''
                }
                onChange={kind => {
                  const picked = places[kind as PlaceKind];
                  picked && setLocation(picked);
                }}
                accessibilityLabel="Saved places"
              />
            )}
          </View>

          <View style={styles.section}>
            <Txt variant="label" color={colors.textMuted}>
              What happened?
            </Txt>
            <ChipGroup
              options={TYPE_OPTIONS}
              value={type}
              onChange={setType}
              accessibilityLabel="Problem type"
            />
          </View>

          <View style={styles.section}>
            <Txt variant="label" color={colors.textMuted}>
              Details (optional)
            </Txt>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="E.g. flat tyre, car is on the right shoulder"
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={500}
              style={styles.input}
              accessibilityLabel="Details"
            />
          </View>
    </>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Notification />
        <View style={styles.header}>
          <BackButton onPress={goBack} />
          <Txt variant="title">Request rescue</Txt>
        </View>

        {/* Places autocomplete is a list, so it cannot sit inside a ScrollView. */}
        {editingLocation ? (
          <View style={[styles.flex1, styles.body]}>{sections}</View>
        ) : (
          <ScrollView
            style={styles.flex1}
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled">
            {sections}
          </ScrollView>
        )}

        <View style={styles.footer}>
          {error && (
            <View style={styles.error} accessibilityLiveRegion="polite">
              <Txt variant="body" color={colors.sos}>
                {error}
              </Txt>
              <AppButton
                label="Call 112"
                variant="secondary"
                onPress={() => Linking.openURL('tel:112')}
              />
            </View>
          )}
          <AppButton
            label={error ? 'Send again' : 'Send SOS'}
            variant="danger"
            loading={sending}
            disabled={!location}
            onPress={send}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default memo(SendDistressSignal);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  header: {
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
    rowGap: space.md,
  },
  flex1: {flex: 1},
  body: {paddingHorizontal: space.xl, paddingVertical: space.xl, rowGap: space.xl},
  section: {rowGap: space.sm},
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: space.sm,
    padding: space.lg,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  flex: {flex: 1, rowGap: space.xs},
  searchBox: {height: 56, zIndex: 4},
  input: {
    minHeight: 96,
    padding: space.lg,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 17,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    paddingBottom: space.xl,
    rowGap: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  error: {rowGap: space.sm},
});
