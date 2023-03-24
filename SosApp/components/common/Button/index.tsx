import {Pressable, StyleSheet, Text, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';

import {BUTTON} from '../../../enums';
import {BLACK_COLOR, EXLIGHT_BLUE_COLOR, WHITE_COLOR} from '../../../themes';

const ButtonType = {
  [BUTTON.DEFAULT]: {
    backgroundColor: BLACK_COLOR,
  },
  [BUTTON.OUTLINE]: {
    borderColor: EXLIGHT_BLUE_COLOR,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
  },
  [BUTTON.PRIMARY]: {},
};

type ButtonProps = {
  label?: string;
  children?: ReactNode;
  borderRadius?: number;
  type?: BUTTON;
  customStyle?: ViewStyle;
};

const CustomButton = ({
  label,
  children,
  borderRadius,
  type,
  customStyle,
}: ButtonProps) => {
  return (
    <Pressable
      style={[
        styles.button,
        {...(borderRadius && {borderRadius})},
        {...(type && {...ButtonType[type]})},
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
