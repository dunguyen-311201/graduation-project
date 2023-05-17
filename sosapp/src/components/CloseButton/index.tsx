import {StyleSheet, Pressable, Image} from 'react-native';
import React from 'react';

import {CloseIcon, DARK_GRAY_COLOR} from '@theme';

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

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    zIndex: 3,
    right: 0,
    top: 0,
    backgroundColor: DARK_GRAY_COLOR,
    opacity: 0.8,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeicon: {
    width: 10,
    height: 10,
  },
});
