import React from 'react';
import {StyleSheet, Pressable, Image} from 'react-native';

import {CloseIcon} from '@theme';
import {colors as themeColors, themedStyles} from '../../theme/tokens';

type CloseButtonProps = {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  onPress?: () => void;
  zIndex?: number;
};

const CloseButton = (props: CloseButtonProps) => {
  return (
    <Pressable style={[styles.closeButton, {...props}]} onPress={props.onPress}>
      <Image source={CloseIcon} style={styles.closeicon} />
    </Pressable>
  );
};

export default CloseButton;

const styles = themedStyles(() => StyleSheet.create({
  closeButton: {
    backgroundColor: themeColors.surfaceRaised,
    opacity: 0.8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeicon: {
    tintColor: themeColors.text,
    width: 12,
    height: 12,
  },
}));
