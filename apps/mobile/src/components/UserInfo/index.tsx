import {
  Alert,
  Linking,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import React, {memo, useCallback} from 'react';

import Avatar from '../ui/Avatar';
import Txt from '../ui/Txt';
import {TOUCH, colors, space} from '../../theme/tokens';
import {useUsers} from '@features/auth';
import {themedStyles} from '../../theme/tokens';

type UserInfoProps = {
  id?: string;
  label?: string;
  marginLeft?: number;
  disabled?: boolean;
  onLongPress?: () => void;
  customStyle?: StyleProp<ViewStyle>;
};

// One person on a request: avatar, name, and a tap-to-call phone number.
const UserInfo = ({
  id,
  label,
  marginLeft,
  onLongPress,
  disabled,
  customStyle,
}: UserInfoProps) => {
  const {user} = useUsers(id);
  const phone = user?.phoneNumber;

  const handleCall = useCallback(() => {
    if (!phone) {
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert('Cannot call', 'This device cannot make phone calls.'),
    );
  }, [phone]);

  const name = user?.displayName || user?.email || '…';

  return (
    <Pressable
      style={[styles.container, {marginLeft}, disabled && styles.disabled, customStyle]}
      disabled={disabled}
      onLongPress={onLongPress}>
      <Avatar name={user?.displayName || user?.email} uri={user?.photoURL} size={44} />
      <View style={styles.flex}>
        {label ? (
          <Txt variant="caption" color={colors.textMuted}>
            {label}
          </Txt>
        ) : null}
        <Txt variant="label" numberOfLines={1}>
          {name}
        </Txt>
        {!phone && user?.email && user.email !== name ? (
          <Txt variant="caption" color={colors.textMuted} numberOfLines={1}>
            {user.email}
          </Txt>
        ) : null}
      </View>
      {phone ? (
        <Pressable
          onPress={handleCall}
          hitSlop={4}
          accessibilityRole="button"
          accessibilityLabel={`Call ${name}`}
          style={({pressed}) => [styles.call, pressed && styles.pressed]}>
          <Txt variant="label" color={colors.primary}>
            Call
          </Txt>
        </Pressable>
      ) : null}
    </Pressable>
  );
};

export default memo(UserInfo);

const styles = themedStyles(() => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: space.md,
    minHeight: TOUCH + 8,
  },
  disabled: {opacity: 0.5},
  flex: {flex: 1, rowGap: 2},
  call: {
    minHeight: TOUCH,
    minWidth: TOUCH + 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingHorizontal: space.lg,
    backgroundColor: colors.surfaceRaised,
  },
  pressed: {backgroundColor: colors.border},
}));
