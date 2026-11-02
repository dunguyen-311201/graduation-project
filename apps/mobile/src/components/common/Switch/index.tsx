import React from 'react';
import {StyleSheet, Switch, View} from 'react-native';
import {
  DARK_BLUE_COLOR,
  LIGHT_BLUE_COLOR,
  DARK_GRAY_COLOR,
  TEXT_COLOR,
} from '@theme/color';
import CustomText from '../Text';
import {colors as themeColors, themedStyles} from '../../../theme/tokens';

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
        trackColor={{false: themeColors.textMuted, true: themeColors.primary}}
        thumbColor={value ? themeColors.primaryPressed : themeColors.text}
      />
      <CustomText text={title} />
    </View>
  );
};

export default CustomSwitch;

const styles = themedStyles(() => StyleSheet.create({
  switchGroup: {
    flexDirection: 'row',
  },
}));
