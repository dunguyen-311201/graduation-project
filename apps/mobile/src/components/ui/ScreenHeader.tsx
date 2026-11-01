import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';

import BackButton from '../BackButton';
import {colors, space} from '../../theme/tokens';
import Txt from './Txt';

type ScreenHeaderProps = {title: string; subtitle?: string; onBack?: () => void};

const ScreenHeader = ({title, subtitle, onBack}: ScreenHeaderProps) => (
  <View style={styles.header}>
    {onBack && <BackButton onPress={onBack} />}
    <Txt variant="title" accessibilityRole="header">
      {title}
    </Txt>
    {subtitle ? (
      <Txt variant="body" color={colors.textMuted}>
        {subtitle}
      </Txt>
    ) : null}
  </View>
);

export default memo(ScreenHeader);

const styles = StyleSheet.create({
  header: {paddingHorizontal: space.xl, paddingTop: space.lg, rowGap: space.sm},
});
