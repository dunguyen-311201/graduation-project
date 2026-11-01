import {Image, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';

import {colors} from '../../theme/tokens';
import Txt from './Txt';

type AvatarProps = {
  name?: string | null;
  uri?: string | null;
  size?: number;
};

// Up to two initials from the name, e.g. "Du Nguyen" -> "DN".
const initials = (name?: string | null) => {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
};

const Avatar = ({name, uri, size = 44}: AvatarProps) => {
  const box = {width: size, height: size, borderRadius: size / 2};

  if (uri) {
    return (
      <Image
        source={{uri}}
        style={[styles.base, box]}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <View style={[styles.base, styles.fallback, box]}>
      <Txt
        color={colors.primary}
        style={{fontSize: size * 0.38, lineHeight: size * 0.46, fontWeight: '600'}}>
        {initials(name)}
      </Txt>
    </View>
  );
};

export default memo(Avatar);

const styles = StyleSheet.create({
  base: {backgroundColor: colors.surfaceRaised},
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(83, 90, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(83, 90, 255, 0.35)',
  },
});
