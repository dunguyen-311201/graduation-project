import {Pressable, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';

import {Txt} from '@components';
import {TNotification} from '@types';
import {colors, radius, space, themedStyles} from '../../../theme/tokens';

// Server titles are short codes in capitals ("REQUEST RESCUE"); show a
// readable sentence and a matching icon instead.
const KIND: Record<string, {title: string; glyph: string; tone: 'sos' | 'primary' | 'success'}> = {
  'REQUEST RESCUE': {title: 'New rescue request', glyph: 'SOS', tone: 'sos'},
  'NEW TASK': {title: 'New task assigned', glyph: '＋', tone: 'primary'},
  ASSIGNED: {title: 'Worker assigned', glyph: '➜', tone: 'primary'},
  COMPLETED: {title: 'Rescue completed', glyph: '✓', tone: 'success'},
};

const sentence = (s: string) =>
  s === s.toUpperCase() ? s.charAt(0) + s.slice(1).toLowerCase() : s;

export const kindOf = (title: string) =>
  KIND[title.trim().toUpperCase()] ?? {
    title: sentence(title),
    glyph: '•',
    tone: 'primary' as const,
  };

export const timeLabel = (time: number) => {
  const min = Math.max(0, Math.round((Date.now() - time) / 60000));
  if (min < 1) {
    return 'now';
  }
  if (min < 60) {
    return `${min} min`;
  }
  const h = Math.round(min / 60);
  if (h < 24) {
    return `${h} h`;
  }
  return new Date(time).toLocaleDateString(undefined, {day: 'numeric', month: 'short'});
};

type Props = {
  item: TNotification;
  onPress: (item: TNotification) => void;
  first: boolean;
  last: boolean;
};

const NotificationRow = ({item, onPress, first, last}: Props) => {
  const kind = kindOf(item.title);
  const tone = kind.tone === 'sos' ? colors.sos : kind.tone === 'success' ? colors.success : colors.primary;
  const soft = kind.tone === 'sos' ? colors.sosGlow : kind.tone === 'success' ? colors.successSoft : colors.primarySoft;

  return (
    <Pressable
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${kind.title}. ${item.body}. ${timeLabel(item.time)} ago`}
      style={({pressed}) => [
        styles.row,
        first && styles.first,
        last && styles.last,
        pressed && styles.pressed,
      ]}>
      <View style={[styles.icon, {backgroundColor: soft}]}>
        <Txt
          variant="caption"
          color={tone}
          style={kind.glyph === 'SOS' ? styles.sosGlyph : styles.glyph}>
          {kind.glyph}
        </Txt>
      </View>
      <View style={[styles.text, !last && styles.divider]}>
        <View style={styles.top}>
          <Txt variant="label" numberOfLines={1} style={styles.flex}>
            {kind.title}
          </Txt>
          <Txt variant="caption" color={colors.textMuted}>
            {timeLabel(item.time)}
          </Txt>
        </View>
        <Txt variant="body" color={colors.textMuted} numberOfLines={2}>
          {item.body}
        </Txt>
      </View>
    </Pressable>
  );
};

export default memo(NotificationRow);

const styles = themedStyles(() =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      columnGap: space.md,
      paddingLeft: space.lg,
      backgroundColor: colors.surface,
    },
    first: {borderTopLeftRadius: radius.card, borderTopRightRadius: radius.card},
    last: {borderBottomLeftRadius: radius.card, borderBottomRightRadius: radius.card},
    pressed: {backgroundColor: colors.surfaceRaised},
    icon: {
      width: 40,
      height: 40,
      marginTop: space.md,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    glyph: {fontSize: 18, lineHeight: 22, fontWeight: '700'},
    sosGlyph: {fontSize: 11, lineHeight: 14, fontWeight: '800', letterSpacing: 0.5},
    text: {flex: 1, rowGap: 2, paddingVertical: space.md, paddingRight: space.lg},
    divider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    top: {flexDirection: 'row', alignItems: 'center', columnGap: space.sm},
    flex: {flex: 1},
  }),
);
