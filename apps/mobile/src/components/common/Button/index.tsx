import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, {memo} from 'react';

import {EButton} from '@enums';
import Txt from '../../ui/Txt';
import {TOUCH, colors, radius, space} from '../../../theme/tokens';

type ButtonProps = {
  label?: string;
  children?: React.ReactNode;
  type?: keyof typeof EButton;
  icon?: ImageSourcePropType;
  customStyle?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
  paddingVertical?: number;
  paddingHorizontal?: number;
  onPress?: () => void;
  disabled?: boolean;
  iconSize?: {height: number; width: number};
  isLoading?: boolean;
  reverse?: boolean;
  accessibilityLabel?: string;
};

// Same sizes as ui/AppButton: filled buttons are 52 high with a 15/600 label,
// text buttons (secondary) keep a 48 touch target.
const LABEL_COLOR: Record<keyof typeof EButton, string> = {
  default: colors.onPrimary,
  primary: colors.onPrimary,
  outline: colors.text,
  notify: colors.onPrimary,
  secondary: colors.primary,
};

const CustomButton = ({
  label = '',
  type = 'default',
  icon,
  iconSize,
  customStyle,
  onPress,
  children,
  disabled,
  reverse,
  isLoading = false,
  accessibilityLabel,
}: ButtonProps) => {
  const filled = type === 'default' || type === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{disabled: Boolean(disabled), busy: isLoading}}
      hitSlop={8}
      disabled={disabled || isLoading}
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        styles[type],
        filled && pressed && styles.filledPressed,
        !filled && pressed && styles.pressed,
        reverse && styles.reverseRow,
        customStyle as StyleProp<ViewStyle>,
        disabled && styles.disabled,
      ]}>
      {children}
      {isLoading && filled ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        label !== '' && (
          <Txt
            variant={type === 'notify' ? 'caption' : 'label'}
            color={LABEL_COLOR[type]}>
            {label}
          </Txt>
        )
      )}
      {icon && (
        <View style={reverse && styles.reverseIcon}>
          <Image source={icon} style={iconSize} />
        </View>
      )}
      {isLoading && !filled && <ActivityIndicator color={colors.primary} />}
    </Pressable>
  );
};

export default memo(CustomButton);

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: space.sm,
  },
  default: {
    width: '100%',
    minHeight: TOUCH + 4,
    paddingHorizontal: space.xl,
    borderRadius: radius.card,
    backgroundColor: colors.primary,
  },
  primary: {
    alignSelf: 'flex-start',
    minHeight: TOUCH + 4,
    paddingHorizontal: space.xl,
    borderRadius: radius.card,
    backgroundColor: colors.primary,
  },
  outline: {
    alignSelf: 'flex-start',
    minHeight: 36,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notify: {
    alignSelf: 'flex-start',
    minHeight: 32,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  secondary: {
    alignSelf: 'flex-start',
    minHeight: TOUCH,
    minWidth: TOUCH,
  },
  filledPressed: {backgroundColor: colors.primaryPressed},
  pressed: {opacity: 0.7},
  disabled: {opacity: 0.4},
  reverseRow: {flexDirection: 'row-reverse', columnGap: space.md},
  reverseIcon: {
    padding: space.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
  },
});
