import {StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';

import {AppButton, ScreenHeader, SearchInput, Txt} from '@components';
import {PLACE_LABEL, PlaceKind, useSavedPlaces} from '@features/profile';
import {getAsyncStorage, requestLocationPermission} from '@utils';
import {CURRENT_LOCATION} from '@constants';
import {Location} from '@types';
import {tokens} from '@theme';
import {useNavigation} from '@react-navigation/native';
import {themedStyles} from '../../theme/tokens';

const {colors, space, radius} = tokens;

const KINDS: PlaceKind[] = ['home', 'work'];

// Figma "Favorites: Add Home / Add Work". Saved places show up as one-tap
// choices on the SOS form.
const SavedPlacesScreen = () => {
  const {goBack} = useNavigation();
  const {places, setPlace} = useSavedPlaces();
  const [editing, setEditing] = useState<PlaceKind | null>(null);
  const [locating, setLocating] = useState<PlaceKind | null>(null);

  const useCurrent = useCallback(
    async (kind: PlaceKind) => {
      setLocating(kind);
      await requestLocationPermission();
      const here = await getAsyncStorage<Location>(CURRENT_LOCATION);
      here && (await setPlace(kind, here));
      setLocating(null);
      setEditing(null);
    },
    [setPlace],
  );

  const handlePick = useCallback(
    async (location: Location) => {
      editing && (await setPlace(editing, location));
      setEditing(null);
    },
    [editing, setPlace],
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Saved places"
        subtitle="Pick them in one tap when you request rescue."
        onBack={goBack}
      />
      <View style={styles.body}>
        {KINDS.map(kind => {
          const place = places[kind];
          const isEditing = editing === kind;
          return (
            <View key={kind} style={[styles.card, isEditing && styles.raised]}>
              <Txt variant="label" color={colors.textMuted}>
                {PLACE_LABEL[kind]}
              </Txt>
              {isEditing ? (
                <>
                  <View style={styles.search}>
                    <SearchInput
                      placeholder={`Search your ${kind} address`}
                      onSearch={handlePick}
                      field={kind}
                      zIndex={4}
                    />
                  </View>
                  <AppButton
                    label="Use my current location"
                    variant="secondary"
                    loading={locating === kind}
                    onPress={() => useCurrent(kind)}
                  />
                  <AppButton
                    label="Cancel"
                    variant="ghost"
                    onPress={() => setEditing(null)}
                  />
                </>
              ) : (
                <>
                  <Txt
                    variant="body"
                    color={place ? colors.text : colors.textMuted}
                    numberOfLines={2}>
                    {place?.description || (place ? 'Pinned location' : 'Not set')}
                  </Txt>
                  <View style={styles.actions}>
                    <AppButton
                      label={place ? 'Change' : `Add ${PLACE_LABEL[kind].toLowerCase()}`}
                      variant={place ? 'ghost' : 'secondary'}
                      onPress={() => setEditing(kind)}
                    />
                    {place && (
                      <AppButton
                        label="Remove"
                        variant="ghost"
                        onPress={() => setPlace(kind, null)}
                      />
                    )}
                  </View>
                </>
              )}
            </View>
          );
        })}
        <Txt variant="caption" color={colors.textMuted}>
          Saved places stay on this phone.
        </Txt>
      </View>
    </View>
  );
};

export default SavedPlacesScreen;

const styles = themedStyles(() => StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  body: {padding: space.xl, rowGap: space.lg},
  card: {
    padding: space.lg,
    rowGap: space.sm,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  raised: {zIndex: 4},
  search: {height: 56, zIndex: 4},
  actions: {flexDirection: 'row', columnGap: space.sm},
}));
