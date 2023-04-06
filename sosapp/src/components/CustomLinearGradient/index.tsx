import {StyleProp, ViewStyle} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {DARK_BLUE_COLOR, LIGHT_BLUE_COLOR} from '@theme';

type CustomLinearGradientProps = {
  lineColor?: [color1: string, color2: string];
  children: React.ReactNode;
  customStyle?: StyleProp<ViewStyle>;
};

const CustomLinearGradient = ({
  lineColor = [DARK_BLUE_COLOR, LIGHT_BLUE_COLOR],
  children,
  customStyle,
}: CustomLinearGradientProps) => {
  return (
    <LinearGradient colors={lineColor} style={customStyle}>
      {children}
    </LinearGradient>
  );
};

export default CustomLinearGradient;
