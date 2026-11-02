import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {colors as themeColors} from '../../theme/tokens';


type CustomLinearGradientProps = {
  lineColor?: [color1: string, color2: string];
  children: React.ReactNode;
  customStyle?: StyleProp<ViewStyle>;
};

const CustomLinearGradient = ({
  lineColor = [themeColors.primaryPressed, themeColors.primary],
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
