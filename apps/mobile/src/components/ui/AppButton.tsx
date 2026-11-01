import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import React, {memo} from 'react';

import {TOUCH, colors, radius, space} from '../../theme/tokens';
import Txt from './Txt';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

type AppButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
};

const BG: Record<Variant, [string, string]> = {
  primary: [colors.primary, colors.primaryPressed],
  secondary: [colors.surfaceRaised, colors.border],
  danger: [colors.sos, colors.sosPressed],
  ghost: ['transparent', colors.surfaceRaised],
};

const AppButton = ({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icon,
  style,
  accessibilityHint,
}: AppButtonProps) => {
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{disabled: Boolean(inactive), busy: Boolean(loading)}}
      disabled={inactive}
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        {backgroundColor: BG[variant][pressed ? 1 : 0]},
        variant === 'ghost' && styles.ghost,
        inactive && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <View style={styles.row}>
          {icon}
          <Txt
            variant="label"
            color={variant === 'ghost' ? colors.primary : colors.onPrimary}>
            {label}
          </Txt>
        </View>
      )}
    </Pressable>
  );
};

export default memo(AppButton);

const styles = StyleSheet.create({
  base: {
    minHeight: TOUCH + 4,
    borderRadius: radius.card,
    paddingHorizontal: space.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {minHeight: TOUCH},
  row: {flexDirection: 'row', alignItems: 'center', columnGap: space.sm},
  disabled: {opacity: 0.4},
});
