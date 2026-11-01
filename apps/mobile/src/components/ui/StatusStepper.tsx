import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {colors, space} from '../../theme/tokens';
import Txt from './Txt';
import {themedStyles} from '../../theme/tokens';

// Mirrors the RescueRequest state machine in packages/domain.
const STEPS = [
  {stage: 'PENDING', label: 'Sent'},
  {stage: 'CLAIMED', label: 'Center accepted'},
  {stage: 'ASSIGNED', label: 'Worker assigned'},
  {stage: 'IN_PROGRESS', label: 'On the way'},
  {stage: 'COMPLETED', label: 'Done'},
];

const CLOSED: Record<string, string> = {
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired, no center answered in time',
};

const StatusStepper = ({stage}: {stage?: string}) => {
  if (stage && CLOSED[stage]) {
    return (
      <View style={styles.closed}>
        <Txt variant="label" color={colors.textMuted}>
          {CLOSED[stage]}
        </Txt>
      </View>
    );
  }

  const current = Math.max(
    0,
    STEPS.findIndex(s => s.stage === stage),
  );

  return (
    <View
      style={styles.wrap}
      accessible
      accessibilityLabel={`Status: ${STEPS[current].label}, step ${current + 1} of ${STEPS.length}`}>
      {STEPS.map((step, i) => {
        const done = i <= current;
        const isLast = i === STEPS.length - 1;
        return (
          <View key={step.stage} style={styles.row}>
            <View style={styles.rail}>
              <View
                style={[
                  styles.dot,
                  done && styles.dotDone,
                  i === current && styles.dotCurrent,
                ]}
              />
              {!isLast && (
                <View style={[styles.line, i < current && styles.lineDone]} />
              )}
            </View>
            <Txt
              variant={i === current ? 'label' : 'body'}
              color={done ? colors.text : colors.textMuted}
              style={styles.label}>
              {step.label}
            </Txt>
          </View>
        );
      })}
    </View>
  );
};

export default memo(StatusStepper);

const DOT = 14;

const styles = themedStyles(() => StyleSheet.create({
  wrap: {paddingVertical: space.xs},
  row: {flexDirection: 'row', columnGap: space.md},
  rail: {alignItems: 'center', width: DOT + 6},
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    marginTop: 4,
  },
  dotDone: {borderColor: colors.primary, backgroundColor: colors.primary},
  dotCurrent: {
    width: DOT + 6,
    height: DOT + 6,
    borderRadius: (DOT + 6) / 2,
    marginTop: 1,
    borderColor: colors.text,
  },
  line: {width: 2, flex: 1, minHeight: 18, backgroundColor: colors.border},
  lineDone: {backgroundColor: colors.primary},
  label: {paddingBottom: space.md},
  closed: {paddingVertical: space.sm},
}));
