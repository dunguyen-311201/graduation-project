import {StyleSheet, Switch, View} from 'react-native';
import React from 'react';
import CustomText from '../Text';
import {
  DARK_BLUE_COLOR,
  LIGHT_BLUE_COLOR,
  DARK_GRAY_COLOR,
  TEXT_COLOR,
} from '@theme/color';

type SwitchProps = {
  value: boolean;
  title: string;
  onChange: () => void;
};

const CustomSwitch = ({title, value, onChange}: SwitchProps) => {
  return (
    <View style={styles.switchGroup}>
      <Switch
        value={value}
        onChange={onChange}
        trackColor={{false: DARK_GRAY_COLOR, true: LIGHT_BLUE_COLOR}}
        thumbColor={value ? DARK_BLUE_COLOR : TEXT_COLOR}
      />
      <CustomText text={title} />
    </View>
  );
};

export default CustomSwitch;

const styles = StyleSheet.create({
  switchGroup: {
    flexDirection: 'row',
  },
});
