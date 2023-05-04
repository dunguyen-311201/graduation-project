import {Text, TextStyle, GestureResponderEvent} from 'react-native';
import React, {memo} from 'react';

import {colors, styles} from '@utils';

type CustomTextProps = {
  text: string;
  children?: React.ReactNode | string;
  type?: keyof typeof styles;
  color?: keyof typeof colors;
  customStyle?: TextStyle;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

const CustomText = ({
  text,
  type,
  children,
  customStyle,
  onPress,
  color,
}: CustomTextProps) => {
  return (
    <Text
      style={{
        ...(type && styles[type]),
        ...customStyle,
        ...(color && colors[color]),
      }}
      onPress={onPress}>
      {text}
      {children}
    </Text>
  );
};

export default memo(CustomText);
