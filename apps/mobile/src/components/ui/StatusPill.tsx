import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {TStatus} from '@types';
import {colors, radius, space} from '../../theme/tokens';
import Txt from './Txt';

const STYLE: Record<TStatus, {label: string; color: string}> = {
  pending: {label: 'Waiting for rescue', color: colors.warning},
  'in progress': {label: 'Rescue on the way', color: colors.primary},
  completed: {label: 'Completed', color: colors.success},
  expired: {label: 'Closed', color: colors.textMuted},
};

// Status is always written out, never shown by colour or icon alone.
const StatusPill = ({status}: {status: TStatus}) => {
  const {label, color} = STYLE[status] ?? STYLE.expired;

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

const styles = StyleSheet.create({
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
});
