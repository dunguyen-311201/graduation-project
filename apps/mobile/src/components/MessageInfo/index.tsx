import {Pressable, StyleSheet, View} from 'react-native';
import React, {memo, useCallback} from 'react';
import {StatusPill, Txt} from '../ui';

import {MESSAGE_COMPLETED} from '@constants';
import {TMessage} from '@types';
import {formatTimeAgo} from '@utils';
import {tokens} from '@theme';
import {themedStyles} from '../../theme/tokens';

const {colors, space, radius} = tokens;

// One row in the Requests list: status first, then what and where.
const MessageInfo = ({
  item,
  onPress,
}: {
  item: TMessage;
  onPress: (uid: string) => void;
}) => {
  const handlePress = useCallback(() => onPress(item.id), [item.id, onPress]);

  const when = item.time
    ? item.status === MESSAGE_COMPLETED
      ? new Date(item.time).toLocaleString()
      : formatTimeAgo(item.time)
    : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Opens the request"
      onPress={handlePress}
      style={({pressed}) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.top}>
        <StatusPill status={item.status} />
        {when ? (
          <Txt variant="caption" color={colors.textMuted}>
            {when}
          </Txt>
        ) : null}
      </View>
      <Txt variant="label">{item.type}</Txt>
      {item.description ? (
        <Txt variant="body" color={colors.textMuted} numberOfLines={2}>
          {item.description}
        </Txt>
      ) : null}
      {item.location?.description || item.location?.city ? (
        <Txt variant="caption" color={colors.textMuted} numberOfLines={1}>
          {item.location.description || item.location.city}
        </Txt>
      ) : null}
    </Pressable>
  );
};

export default memo(MessageInfo);

const styles = themedStyles(() => StyleSheet.create({
  card: {
    padding: space.lg,
    rowGap: space.sm,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  pressed: {backgroundColor: colors.surfaceRaised},
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));
