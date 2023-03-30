import {StyleProp, StyleSheet, Text, ViewStyle} from 'react-native';
import React from 'react';
import {EText} from '@enums';
import {LIGHT_BLUE_COLOR, TEXT_COLOR} from '@theme/color';

type CustomTextProps = {
  text: string;
  style: (keyof typeof EText)[];
  customStyle?: StyleProp<ViewStyle>;
};

const CustomText = ({text, style, customStyle}: CustomTextProps) => {
  const _styles = style.map(key => styles[EText[key]]);

  return <Text style={[styles.text, ..._styles, customStyle]}>{text}</Text>;
};

export default CustomText;

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
});
