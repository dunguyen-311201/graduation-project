import {Pressable, StyleSheet, Text, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';

import {EBUTTON} from '../../../enums';
import {BUTTON} from '../../../types';
import {BLACK_COLOR, WHITE_COLOR} from '../../../themes';

const ButtonType = {
  [EBUTTON.DEFAULT]: {
    backgroundColor: BLACK_COLOR,
  },
  [EBUTTON.OUTLINE]: {
    // borderColor: EXLIGHT_BLUE_COLOR,
    // borderWidth: 1.5,
    // borderRadius: 16,
    // paddingVertical: 14,
    // paddingHorizontal: 24,
    // alignSelf: 'flex-start',
  },
  [EBUTTON.PRIMARY]: {},
};

type ButtonProps = {
  label?: string;
  children?: ReactNode;
  borderRadius?: number;
  type?: BUTTON;
  onPress?: () => void;
  customStyle?: ViewStyle;
};

const CustomButton = ({
  label,
  children,
  borderRadius,
  type = EBUTTON.DEFAULT,
  onPress,
  customStyle,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {...(borderRadius && {borderRadius})},
        {...(type && {})},
        customStyle,
      ]}>
      {children ? children : <Text style={[styles.textButton]}>{label}</Text>}
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    color: WHITE_COLOR,
  },
});
