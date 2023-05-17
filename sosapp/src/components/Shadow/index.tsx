import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import CustomLinearGradient from '../CustomLinearGradient';
import {BLACK_COLOR} from '@theme/color';

type ShadowProps = {
  customStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  paddingVertical?: number;
};

const Shadow = ({customStyle, children, paddingVertical}: ShadowProps) => {
  return (
    <CustomLinearGradient customStyle={[styles.shadow1, customStyle]}>
      <CustomLinearGradient
        customStyle={[styles.shadow2, {paddingVertical}, customStyle]}>
        {children}
      </CustomLinearGradient>
    </CustomLinearGradient>
  );
};

export default memo(Shadow);

const styles = StyleSheet.create({
  shadow1: {
    borderRadius: 20,
    shadowColor: BLACK_COLOR,
    shadowOffset: {
      width: -4,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  shadow2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgb(189,189,189)',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
