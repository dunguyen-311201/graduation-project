import {StyleSheet, Text, TextStyle} from 'react-native';
import React from 'react';
import {TEXT} from '../../../types';
import {ETEXT} from '../../../enums';
import {EXLIGHT_BLUE_COLOR} from '../../../themes';

type TextProps = {
  text: string;
  bold?: boolean;
  customStyle?: TextStyle;
  size?: TEXT;
};

const TextSize = {
  [ETEXT.Small]: {
    fontSize: 16,
  },
  [ETEXT.Large]: {
    fontSize: 64,
  },
  [ETEXT.ELarge]: {
    fontSize: 30,
  },
  [ETEXT.Normal]: {
    fontSize: 20,
  },
  [ETEXT.XNormal]: {
    fontSize: 24,
  },
};

const CustomText = ({text, bold, size = 'normal', customStyle}: TextProps) => {
  return (
    <Text
      style={[
        styles.text,
        {...(bold && styles.textBold)},
        TextSize[size],
        customStyle,
      ]}>
      {text}
    </Text>
  );
};

export default CustomText;

const styles = StyleSheet.create({
  text: {
    color: EXLIGHT_BLUE_COLOR,
  },
  textBold: {
    fontWeight: '600',
  },
});
