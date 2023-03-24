import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {DART_BLUE_COLOR, LIGHT_BLUE_COLOR} from '../../themes';

interface props {
  children: React.ReactNode;
  customStyle?: StyleProp<ViewStyle>;
  flex?: boolean;
  borderRadius?: number;
  maxWidth?: boolean;
  row?: boolean;
}

const CustomLinearGradient = ({
  children,
  maxWidth,
  customStyle,
  row,
  flex,
  borderRadius = 0,
}: props) => {
  return (
    <LinearGradient
      colors={[DART_BLUE_COLOR, LIGHT_BLUE_COLOR]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[
        styles.linearGradient,
        {...(flex && {flex: 1}), borderRadius},
        customStyle,
        {...(row && styles.flexRow)},
        {...(maxWidth && styles.maxWidth)},
      ]}>
      {children}
    </LinearGradient>
  );
};

export default CustomLinearGradient;

const styles = StyleSheet.create({
  linearGradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  maxWidth: {
    width: '100%',
  },
  flexRow: {
    flexDirection: 'row',
  },
});
