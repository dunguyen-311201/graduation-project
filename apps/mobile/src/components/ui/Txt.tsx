import React, {memo} from 'react';
import {StyleProp, StyleSheet, Text, TextProps, TextStyle} from 'react-native';

import {colors, type as typeScale} from '../../theme/tokens';

type Variant = keyof typeof typeScale;

type TxtProps = TextProps & {
  variant?: Variant;
  color?: string;
  center?: boolean;
  style?: StyleProp<TextStyle>;
};

const Txt = ({
  variant = 'body',
  color = colors.text,
  center,
  style,
  ...rest
}: TxtProps) => (
  <Text
    {...rest}
    style={[
      typeScale[variant] as TextStyle,
      {color},
      center && styles.center,
      style,
    ]}
  />
);

export default memo(Txt);

const styles = StyleSheet.create({center: {textAlign: 'center'}});
