import {StyleSheet, Pressable, Image} from 'react-native';
import React from 'react';

import {OptionIcon} from '@theme';

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

const styles = StyleSheet.create({
  OptionsButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
