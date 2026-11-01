import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';

import BackButton from '../BackButton';
import {colors, space, themedStyles} from '../../theme/tokens';
import Txt from './Txt';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
};

// Compact top bar for pushed screens: back, title and an optional action on
// one 56 dp row. Tab roots use a large title instead (no back button).
const ScreenHeader = ({title, subtitle, onBack, right}: ScreenHeaderProps) => (
  <View>
    <View style={[styles.bar, !onBack && styles.barRoot]}>
      {onBack && <BackButton onPress={onBack} />}
      <Txt
        variant={onBack ? 'heading' : 'title'}
        numberOfLines={1}
        accessibilityRole="header"
        style={styles.title}>
        {title}
      </Txt>
      {right}
    </View>
    {subtitle ? (
      <Txt variant="body" color={colors.textMuted} style={styles.subtitle}>
        {subtitle}
      </Txt>
    ) : null}
  </View>
);

export default memo(ScreenHeader);

const styles = themedStyles(() =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 56,
      paddingLeft: space.sm,
      paddingRight: space.lg,
      columnGap: space.xs,
    },
    barRoot: {paddingLeft: space.xl, paddingTop: space.md},
    title: {flex: 1},
    subtitle: {paddingHorizontal: space.xl, paddingBottom: space.sm},
  }),
);
