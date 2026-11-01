import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {TOUCH, colors, radius, space} from '../../theme/tokens';
import Txt from './Txt';
import {themedStyles} from '../../theme/tokens';

type ChipGroupProps = {
  options: {value: string; label: string}[];
  value?: string;
  onChange: (value: string) => void;
  accessibilityLabel?: string;
};

const ChipGroup = ({
  options,
  value,
  onChange,
  accessibilityLabel,
}: ChipGroupProps) => (
  <View
    style={styles.wrap}
    accessibilityRole="radiogroup"
    accessibilityLabel={accessibilityLabel}>
    {options.map(option => {
      const selected = option.value === value;
      return (
        <Pressable
          key={option.value}
          accessibilityRole="radio"
          accessibilityState={{selected}}
          onPress={() => onChange(option.value)}
          style={[styles.chip, selected && styles.selected]}>
          <Txt
            variant="label"
            color={selected ? colors.onPrimary : colors.text}>
            {option.label}
          </Txt>
        </Pressable>
      );
    })}
  </View>
);

export default memo(ChipGroup);

const styles = themedStyles(() => StyleSheet.create({
  wrap: {flexDirection: 'row', flexWrap: 'wrap', gap: space.sm},
  chip: {
    minHeight: TOUCH - 8,
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
  },
  selected: {backgroundColor: colors.primary, borderColor: colors.primary},
}));
