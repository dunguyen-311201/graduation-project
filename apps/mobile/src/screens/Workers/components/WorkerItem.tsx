import {ImageSourcePropType, Pressable, StyleSheet, View} from 'react-native';
import React, {memo, useCallback} from 'react';
import {Txt} from '@components';

import {TUser} from '@types';
import {tokens} from '@theme';

const {colors, space, radius} = tokens;

const availability = (user: TUser) => {
  if (user.disabled) {
    return {label: 'Disabled', color: colors.textMuted};
  }
  if (user.status === 'busy') {
    return {label: 'On a rescue', color: colors.warning};
  }
  if (user.status === 'free' && user.lastLogin) {
    return {label: 'Available', color: colors.success};
  }
  return {label: 'Offline', color: colors.textMuted};
};

const WorkerItem = ({
  user,
  callback,
}: {
  user: TUser;
  icon?: ImageSourcePropType;
  callback: (id: string) => void;
}) => {
  const handle = useCallback(() => callback(user.id), [callback, user.id]);
  const state = availability(user);
  const name = user.displayName || user.email || 'Worker';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${state.label}`}
      accessibilityHint="Shows actions for this worker"
      onPress={handle}
      style={({pressed}) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.avatar}>
        <Txt variant="label">{name.charAt(0).toUpperCase()}</Txt>
      </View>
      <View style={styles.flex}>
        <Txt variant="label" style={styles.name}>
          {name}
        </Txt>
        <View style={styles.row}>
          <View style={[styles.dot, {backgroundColor: state.color}]} />
          <Txt variant="caption" color={state.color}>
            {state.label}
          </Txt>
        </View>
      </View>
      <Txt variant="heading" color={colors.textMuted}>
        ›
      </Txt>
    </Pressable>
  );
};

export default memo(WorkerItem);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: space.md,
    padding: space.lg,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  pressed: {backgroundColor: colors.surfaceRaised},
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
  },
  flex: {flex: 1, rowGap: 2},
  name: {textTransform: 'capitalize'},
  row: {flexDirection: 'row', alignItems: 'center', columnGap: 6},
  dot: {width: 8, height: 8, borderRadius: 4},
});
