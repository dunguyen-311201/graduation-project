import {Image, Pressable, StyleSheet} from 'react-native';

import {OptionIcon} from '@theme';
import React from 'react';
import {themedStyles} from '../../theme/tokens';

type OptionsButtonProps = {
  onPress?: () => void;
};

const OptionsButton = ({onPress}: OptionsButtonProps) => {
  return (
    <Pressable style={styles.OptionsButton} onPress={onPress}>
      <Image source={OptionIcon} />
    </Pressable>
  );
};

export default OptionsButton;

const styles = themedStyles(() => StyleSheet.create({
  OptionsButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
