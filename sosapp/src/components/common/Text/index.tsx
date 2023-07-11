import React, {memo} from 'react';
import {Text, TextStyle, StyleSheet, GestureResponderEvent} from 'react-native';

import {WHITE_COLOR} from '@theme';
import {colors, styles} from '@utils';

type CustomTextProps = {
  text?: string;
  children?: React.ReactNode | string;
  type?: keyof typeof styles;
  color?: keyof typeof colors;
  customStyle?: TextStyle;
  border?: boolean;
  center?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

const CustomText = ({
  text = '',
  type = 'text_medium_20',
  children,
  customStyle,
  onPress,
  border = false,
  color,
  center,
}: CustomTextProps) => {
  return (
    <Text
      style={{
        ..._styles.text,
        ...(type && styles[type]),
        ...(color && colors[color]),
        ...(border && _styles.border),
        ...customStyle,
        ...(center && {textAlign: 'center'}),
      }}
      onPress={onPress}>
      {text}
      {children}
    </Text>
  );
};

export default memo(CustomText);

const _styles = StyleSheet.create({
  text: {},
  border: {
    borderColor: WHITE_COLOR,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
