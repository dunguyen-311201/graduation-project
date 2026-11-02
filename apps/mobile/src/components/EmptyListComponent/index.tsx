import {ActivityIndicator, StyleSheet, View} from 'react-native';

import React from 'react';
import Txt from '../ui/Txt';
import {colors, space} from '../../theme/tokens';
import {themedStyles} from '../../theme/tokens';

// `loading` holds the empty message back until the first data has arrived.
const EmptyListComponent = ({
  text,
  hint,
  loading,
}: {
  text?: string;
  hint?: string;
  loading?: boolean;
}) => (
  <View style={styles.container}>
    {loading ? (
      <ActivityIndicator
        size="large"
        color={colors.primary}
        accessibilityLabel="Loading"
      />
    ) : (
      <>
        <Txt variant="heading" center>
          {text || 'Nothing here yet'}
        </Txt>
        {hint ? (
          <Txt variant="body" color={colors.textMuted} center>
            {hint}
          </Txt>
        ) : null}
      </>
    )}
  </View>
);

export default EmptyListComponent;

const styles = themedStyles(() => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: space.sm,
    paddingHorizontal: space.xl,
  },
}));
