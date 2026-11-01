import React, {memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

import {colors, radius, space} from '../../theme/tokens';
import {themedStyles} from '../../theme/tokens';

// A bottom sheet that sits over a full-screen map.
const Sheet = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => (
  <View style={[styles.sheet, style]}>
    <View style={styles.handle} />
    {children}
  </View>
);

export default memo(Sheet);

const styles = themedStyles(() => StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: space.xl,
    paddingTop: space.sm,
    paddingBottom: space.xl,
    rowGap: space.lg,
    elevation: 16,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: -4},
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
}));
