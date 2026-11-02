import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {TStatus} from '@types';
import {colors, radius, space} from '../../theme/tokens';
import Txt from './Txt';
import {themedStyles} from '../../theme/tokens';

// A function, so colors are read for the active theme.
const STYLE = (): Record<TStatus, {label: string; color: string}> => ({
  pending: {label: 'Waiting for rescue', color: colors.warning},
  'in progress': {label: 'Rescue on the way', color: colors.primary},
  completed: {label: 'Completed', color: colors.success},
  expired: {label: 'Expired', color: colors.textMuted},
});

// Status is always written out, never shown by colour or icon alone.
const StatusPill = ({status, stage}: {status: TStatus; stage?: string}) => {
  const map = STYLE();
  const {label: statusLabel, color} = map[status] ?? map.expired;
  const label = stage === 'CANCELLED' ? 'Cancelled' : statusLabel;

  return (
    <View style={[styles.pill, {borderColor: color}]}>
      <View style={[styles.dot, {backgroundColor: color}]} />
      <Txt variant="caption" color={color}>
        {label}
      </Txt>
    </View>
  );
};

export default memo(StatusPill);

const styles = themedStyles(() => StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    columnGap: space.xs + 2,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  dot: {width: 8, height: 8, borderRadius: 4},
}));
