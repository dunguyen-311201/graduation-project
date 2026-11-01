import {StyleSheet, View} from 'react-native';

import React from 'react';
import Txt from '../ui/Txt';
import {colors, space} from '../../theme/tokens';

const EmptyListComponent = ({text, hint}: {text?: string; hint?: string}) => (
  <View style={styles.container}>
    <Txt variant="heading" center>
      {text || 'Nothing here yet'}
    </Txt>
    {hint ? (
      <Txt variant="body" color={colors.textMuted} center>
        {hint}
      </Txt>
    ) : null}
  </View>
);

export default EmptyListComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: space.sm,
    paddingHorizontal: space.xl,
  },
});
