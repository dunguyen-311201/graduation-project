import {ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import Constants from 'expo-constants';

import {ScreenHeader, Txt} from '@components';
import {tokens} from '@theme';
import {useNavigation} from '@react-navigation/native';
import {themedStyles} from '../../theme/tokens';

const {colors, space, radius} = tokens;

const SECTIONS: {title: string; body: string[]}[] = [
  {
    title: 'What we collect',
    body: [
      'Your name and phone number, so the rescue team can call you.',
      'Your location, only while you use the app or have an open request.',
      'The details you type into a rescue request.',
    ],
  },
  {
    title: 'Who can see it',
    body: [
      'Rescue centers near you see a new request and its location.',
      'Only the center and the worker who take your request see it after that.',
      'We do not sell your data or show you ads.',
    ],
  },
  {
    title: 'Kept only on this phone',
    body: [
      'Emergency contacts, saved places and your ratings never leave this device.',
      'Uninstalling the app or clearing its data removes them.',
    ],
  },
  {
    title: 'Terms of use',
    body: [
      'SOS connects you with roadside rescue teams. It does not replace emergency services: call 112 if anyone is hurt.',
      'Send a request only when you really need help. False requests take teams away from people who do.',
      'Response times depend on how many teams are free near you.',
    ],
  },
];

// Figma "Account Settings: Privacy / Legal", as one readable page.
const PrivacyLegalScreen = () => {
  const {goBack} = useNavigation();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <View style={styles.container}>
      <ScreenHeader title="Privacy & terms" onBack={goBack} />
      <ScrollView contentContainerStyle={styles.body}>
        {SECTIONS.map(section => (
          <View key={section.title} style={styles.card}>
            <Txt variant="heading">{section.title}</Txt>
            {section.body.map(line => (
              <View key={line} style={styles.point}>
                <View style={styles.dot} />
                <Txt variant="body" color={colors.textMuted} style={styles.flex}>
                  {line}
                </Txt>
              </View>
            ))}
          </View>
        ))}
        <Txt variant="caption" color={colors.textMuted} center>
          SOS app version {version}
        </Txt>
      </ScrollView>
    </View>
  );
};

export default PrivacyLegalScreen;

const styles = themedStyles(() => StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  body: {padding: space.xl, rowGap: space.lg},
  card: {
    padding: space.lg,
    rowGap: space.md,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  point: {flexDirection: 'row', columnGap: space.md},
  dot: {
    width: 6,
    height: 6,
    marginTop: 9,
    borderRadius: 3,
    backgroundColor: colors.textMuted,
  },
  flex: {flex: 1},
}));
