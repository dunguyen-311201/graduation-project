import {Pressable, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';

import {TOUCH, colors, space} from '../../theme/tokens';
import Txt from './Txt';

type ListRowProps = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
};

// One row of a settings-style list: title, optional subtitle, chevron.
const ListRow = ({title, subtitle, onPress, right, danger}: ListRowProps) => (
  <Pressable
    accessibilityRole={onPress ? 'button' : undefined}
    accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
    disabled={!onPress}
    onPress={onPress}
    style={({pressed}) => [styles.row, pressed && styles.pressed]}>
    <View style={styles.flex}>
      <Txt variant="body" color={danger ? colors.sos : colors.text}>
        {title}
      </Txt>
      {subtitle ? (
        <Txt variant="caption" color={colors.textMuted} numberOfLines={2}>
          {subtitle}
        </Txt>
      ) : null}
    </View>
    {right ??
      (onPress ? (
        <Txt variant="heading" color={colors.textMuted}>
          ›
        </Txt>
      ) : null)}
  </Pressable>
);

export default memo(ListRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: space.md,
    minHeight: TOUCH + 8,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
  },
  pressed: {backgroundColor: colors.surfaceRaised},
  flex: {flex: 1, rowGap: 2},
});
