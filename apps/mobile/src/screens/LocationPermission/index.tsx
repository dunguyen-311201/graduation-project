import {Image, Linking, StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import * as ExpoLocation from 'expo-location';

import {AppButton, Txt} from '@components';
import {FromLocationIcon, tokens} from '@theme';
import {requestLocationPermission} from '@utils';
import {useNavigation} from '@react-navigation/native';

const {colors, space, radius} = tokens;

const POINTS = [
  'Rescue centers within 10 km see where you are and can reach you fast.',
  'Your location is shared only with the team that handles your request.',
  'You can still send an SOS by typing an address if you say no.',
];

// Explains why we need location before the system prompt, so fewer people
// tap "Don't allow" by reflex (Figma "Turn on location").
const LocationPermissionScreen = () => {
  const {goBack} = useNavigation();
  const [busy, setBusy] = useState(false);

  const handleAllow = useCallback(async () => {
    setBusy(true);
    const {canAskAgain} = await ExpoLocation.getForegroundPermissionsAsync();
    if (canAskAgain) {
      await requestLocationPermission(0);
    } else {
      // Android stops showing the prompt after two refusals.
      await Linking.openSettings();
    }
    setBusy(false);
    goBack();
  }, [goBack]);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View style={styles.badge}>
          <Image source={FromLocationIcon} style={styles.icon} />
        </View>
        <Txt variant="title" center accessibilityRole="header">
          Turn on location
        </Txt>
        <Txt variant="body" color={colors.textMuted} center>
          So help can find you the moment you hold the SOS button.
        </Txt>
        <View style={styles.points}>
          {POINTS.map(point => (
            <View key={point} style={styles.point}>
              <View style={styles.dot} />
              <Txt variant="body" style={styles.flex}>
                {point}
              </Txt>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <AppButton label="Turn on location" loading={busy} onPress={handleAllow} />
        <AppButton label="Not now" variant="ghost" onPress={goBack} />
      </View>
    </View>
  );
};

export default LocationPermissionScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg, padding: space.xl},
  body: {flex: 1, justifyContent: 'center', rowGap: space.lg},
  badge: {
    alignSelf: 'center',
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(83, 90, 255, 0.16)',
  },
  icon: {width: 44, height: 44, tintColor: colors.primary},
  points: {
    rowGap: space.md,
    padding: space.lg,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  point: {flexDirection: 'row', columnGap: space.md},
  dot: {
    width: 8,
    height: 8,
    marginTop: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  flex: {flex: 1},
  footer: {rowGap: space.sm},
});
