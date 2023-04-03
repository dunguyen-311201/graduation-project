import {StyleProp, StyleSheet, Text, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import {EText} from '@enums';
import {BLACK_COLOR, LIGHT_BLUE_COLOR, TEXT_COLOR} from '@theme/color';

type CustomTextProps = {
  text: string;
  style: (keyof typeof EText)[];
  customStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode | string;
  type?: keyof typeof EText;
};

const CustomText = ({
  text,
  type = 'md',
  style,
  customStyle,
  children,
}: CustomTextProps) => {
  const _styles = style.map(key => styles[EText[key]]);

  return (
    <Text
      style={[
        styles.text,
        ..._styles,
        {...(type && styles[EText[type]])},
        customStyle,
      ]}>
      {text}
      {children}
    </Text>
  );
};

export default memo(CustomText);

const styles = StyleSheet.create({
  text: {
    fontWeight: '400',
    fontSize: 20,
    color: TEXT_COLOR,
  },
  text_bold: {
    fontWeight: '600',
  },
  [EText.fs16]: {
    fontSize: 64,
  },
  [EText.fs5]: {fontSize: 20},
  [EText.fs52]: {fontSize: 22},
  [EText.fs6]: {
    fontSize: 24,
  },
  [EText.fw4]: {fontWeight: '400'},
  [EText.fw6]: {fontWeight: '600'},
  [EText.fw7]: {
    fontWeight: '700',
  },
  [EText.fs72]: {
    fontSize: 30,
  },
  [EText.fw5]: {
    fontWeight: '500',
  },
  [EText.cbl]: {
    color: LIGHT_BLUE_COLOR,
  },
  [EText.cga]: {
    color: '#EDF6FF',
  },
  [EText.cbla]: {
    color: BLACK_COLOR,
  },
  [EText.sm]: {
    fontSize: 15,
    fontWeight: '400',
  },
  [EText.md]: {
    fontSize: 20,
    fontWeight: '500',
  },
});
