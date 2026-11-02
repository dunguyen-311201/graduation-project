import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {TOUCH, colors, themedStyles} from '../../theme/tokens';

type BackButtonProps = {
  onPress?: () => void;
};

// A drawn chevron (no image or icon font), so it is crisp at any density and
// follows the theme colour.
const BackButton = ({onPress}: BackButtonProps) => (
  <Pressable
    onPress={onPress}
    hitSlop={4}
    accessibilityRole="button"
    accessibilityLabel="Go back"
    style={({pressed}) => [styles.button, pressed && styles.pressed]}>
    <View style={styles.chevron} />
  </Pressable>
);

export default memo(BackButton);

const styles = themedStyles(() =>
  StyleSheet.create({
    button: {
      width: TOUCH - 4,
      height: TOUCH - 4,
      borderRadius: TOUCH,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    pressed: {backgroundColor: colors.surfaceRaised},
    chevron: {
      width: 12,
      height: 12,
      marginLeft: 4,
      borderLeftWidth: 2.5,
      borderBottomWidth: 2.5,
      borderColor: colors.text,
      borderBottomLeftRadius: 1,
      transform: [{rotate: '45deg'}],
    },
  }),
);
