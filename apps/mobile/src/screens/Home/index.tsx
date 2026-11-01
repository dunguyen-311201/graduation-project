import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  View,
} from 'react-native';
import {
  AppButton,
  HoldToSosButton,
  Notification,
  Sheet,
  StatusPill,
  Txt,
} from '@components';
import {tokens} from '@theme';
import {ERole, EScreen} from '@enums';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {getAsyncStorage, requestLocationPermission} from '@utils';
import {newIdempotencyKey, useMessages} from '@features/rescue';

import {CURRENT_LOCATION, MAPS_ENABLED} from '@constants';
import {Context} from '@context';
import {Location} from '@types';
import {RootScreenNavigationProps} from '@navigation';
import {isFreeUser} from '@features/auth';
import {useNavigation} from '@react-navigation/native';

const {colors, space} = tokens;

// Time to cancel a quick SOS before it is sent.
const UNDO_SECONDS = 5;
const QUICK_SOS_TYPE = 'Rescue request';

type SosState =
  | {kind: 'idle'}
  | {kind: 'countdown'; left: number}
  | {kind: 'sending'}
  | {kind: 'error'; message: string};

const timeAgo = (time: number) => {
  const min = Math.max(0, Math.round((Date.now() - time) / 60000));
  if (min < 1) {
    return 'just now';
  }
  if (min < 60) {
    return `${min} min ago`;
  }
  return `${Math.round(min / 60)} h ago`;
};

const HomeScreen = () => {
  const {navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.DRAWER>>();

  const {currentUser} = useContext(Context);
  const isUser = currentUser?.role === ERole.USER;

  const {messages, onNew, onDelete} = useMessages();

  const [location, setLocation] = useState<Location | null>(null);
  const [locating, setLocating] = useState(false);
  const [sos, setSos] = useState<SosState>({kind: 'idle'});
  const requestId = useRef(newIdempotencyKey());

  const activeRequest = useMemo(
    () =>
      messages.find(m => m.status === 'pending' || m.status === 'in progress'),
    [messages],
  );

  useEffect(() => {
    getAsyncStorage<Location>(CURRENT_LOCATION).then(
      cache => cache && setLocation(cache),
    );
  }, []);

  const handleTurnOnLocation = useCallback(async () => {
    setLocating(true);
    await requestLocationPermission();
    const cache = await getAsyncStorage<Location>(CURRENT_LOCATION);
    cache && setLocation(cache);
    setLocating(false);
  }, []);

  const sendQuickSos = useCallback(async () => {
    if (!location) {
      return;
    }
    setSos({kind: 'sending'});
    try {
      await onNew({
        id: requestId.current,
        type: QUICK_SOS_TYPE,
        description: '',
        status: 'pending',
        time: Date.now(),
        userID: currentUser?.id ?? '',
        location,
      });
      requestId.current = newIdempotencyKey();
      setSos({kind: 'idle'});
    } catch (error: any) {
      setSos({
        kind: 'error',
        message:
          error?.message ||
          'Your request was not confirmed. Check your connection and try again.',
      });
    }
  }, [location, onNew, currentUser]);

  // Count down, then send. Cancel stops it.
  useEffect(() => {
    if (sos.kind !== 'countdown') {
      return;
    }
    if (sos.left === 0) {
      sendQuickSos();
      return;
    }
    const t = setTimeout(
      () => setSos({kind: 'countdown', left: sos.left - 1}),
      1000,
    );
    return () => clearTimeout(t);
  }, [sos, sendQuickSos]);

  const handleHold = useCallback(async () => {
    if (!location) {
      Alert.alert(
        'Location needed',
        'Turn on location so the rescue team can find you.',
      );
      return;
    }
    if (!(await isFreeUser())) {
      Alert.alert(
        'Request already open',
        'You already have a request in progress. Wait until it is completed.',
      );
      return;
    }
    setSos({kind: 'countdown', left: UNDO_SECONDS});
  }, [location]);

  const handleCancel = useCallback(() => setSos({kind: 'idle'}), []);

  const handleAddDetails = useCallback(() => {
    setSos({kind: 'idle'});
    navigate(EScreen.SEND_DISTRESS_SIGNAL, {onNew});
  }, [navigate, onNew]);

  const handleCall112 = useCallback(() => Linking.openURL('tel:112'), []);

  const handleOpenRequest = useCallback(
    (id: string) => navigate(EScreen.DETAIL_MESSAGE, {id, onDelete}),
    [navigate, onDelete],
  );

  const region = location && {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const renderUserSheet = () => {
    if (activeRequest) {
      return (
        <>
          <StatusPill status={activeRequest.status} />
          <Txt variant="heading">{activeRequest.type}</Txt>
          <Txt variant="caption" color={colors.textMuted}>
            Sent {timeAgo(activeRequest.time)}
            {activeRequest.location?.description
              ? ` · ${activeRequest.location.description}`
              : ''}
          </Txt>
          <AppButton
            label="View request"
            onPress={() => handleOpenRequest(activeRequest.id)}
          />
        </>
      );
    }

    if (sos.kind === 'countdown') {
      return (
        <>
          <Txt variant="title" center>
            Sending SOS in {sos.left}
          </Txt>
          <Txt variant="body" color={colors.textMuted} center>
            Rescue centers near you will be alerted with your location.
          </Txt>
          <AppButton label="Cancel" variant="secondary" onPress={handleCancel} />
          <AppButton
            label="Add details instead"
            variant="ghost"
            onPress={handleAddDetails}
          />
        </>
      );
    }

    if (sos.kind === 'sending') {
      return (
        <View style={styles.center}>
          <ActivityIndicator color={colors.sos} size="large" />
          <Txt variant="label">Sending your SOS…</Txt>
        </View>
      );
    }

    if (sos.kind === 'error') {
      return (
        <>
          <Txt variant="heading">SOS not sent</Txt>
          <Txt variant="body" color={colors.textMuted}>
            {sos.message} If it is urgent, call 112.
          </Txt>
          <AppButton label="Try again" variant="danger" onPress={sendQuickSos} />
          <AppButton label="Call 112" variant="secondary" onPress={handleCall112} />
        </>
      );
    }

    return (
      <>
        <Txt variant="heading" center>
          Vehicle trouble?
        </Txt>
        <HoldToSosButton onTrigger={handleHold} disabled={!location} size={168} />
        {location ? (
          <Txt variant="caption" color={colors.textMuted} center>
            Your location: {location.description || 'current position'}
          </Txt>
        ) : (
          <AppButton
            label="Turn on location"
            variant="secondary"
            loading={locating}
            onPress={handleTurnOnLocation}
          />
        )}
        <AppButton
          label="Describe the problem first"
          variant="ghost"
          onPress={handleAddDetails}
        />
      </>
    );
  };

  const renderStaffSheet = () => (
    <>
      <Txt variant="heading">
        {currentUser?.role === ERole.CENTER ? 'Rescue center' : 'Your tasks'}
      </Txt>
      <AppButton
        label="Rescue requests"
        onPress={() => navigate(EScreen.MESSAGES)}
      />
      {currentUser?.role === ERole.CENTER && (
        <AppButton
          label="Workers"
          variant="secondary"
          onPress={() => navigate(EScreen.WORKER)}
        />
      )}
      <AppButton
        label="Open map"
        variant="secondary"
        onPress={() => navigate(EScreen.MAP)}
      />
    </>
  );

  return (
    <View style={styles.container}>
      <Notification />
      {region && MAPS_ENABLED ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton={false}
          toolbarEnabled={false}>
          <Marker coordinate={region} pinColor={colors.sos} />
        </MapView>
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.mapPlaceholder]} />
      )}

      <Sheet>{isUser ? renderUserSheet() : renderStaffSheet()}</Sheet>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  mapPlaceholder: {backgroundColor: colors.surface},
  center: {alignItems: 'center', rowGap: space.md, paddingVertical: space.xl},
});
