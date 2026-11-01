import {
  BLACK_COLOR,
  DARK_GRAY_COLOR,
  GRAY_COLOR,
  LIGHT_BLUE_COLOR,
  TEXT_COLOR,
  WHITE_COLOR,
  tokens,
} from '@theme';
import {StyleSheet} from 'react-native';

const BaseStyles = StyleSheet.create({
  text_default: {
    fontFamily: 'Roboto',
    color: WHITE_COLOR,
    fontSize: 20,
    fontWeight: '500',
  },
  text_regular: {
    fontWeight: '400',
  },
  text_large: {
    fontSize: 64,
    fontWeight: '600',
    fontFamily: 'Open-sans',
  },
  text_medium_7_22: {
    fontWeight: '700',
    fontSize: 22,
  },
  text_medium_24: {
    fontSize: 24,
  },
  text_medium_30: {
    fontSize: 30,
  },
  text_medium_18: {
    fontSize: 18,
  },
  text_small_5_16: {
    fontSize: 16,
  },
  text_small_5_14: {
    fontSize: 16,
  },
  text_medium_27: {
    fontSize: 27,
    fontWeight: '400',
  },
});

const ColorStyles = StyleSheet.create({
  dedault: {
    color: TEXT_COLOR,
  },
  gray: {
    color: GRAY_COLOR,
  },
  white: {
    color: WHITE_COLOR,
  },
  black: {
    color: BLACK_COLOR,
  },
  light_blue: {
    color: LIGHT_BLUE_COLOR,
  },
  dark_gray: {
    color: DARK_GRAY_COLOR,
  },
});

export const Styles = {
  text_large_white: {
    ...BaseStyles.text_default,
    ...BaseStyles.text_large,
  },
  text_large_black: {
    ...BaseStyles.text_default,
    ...BaseStyles.text_large,
    ...ColorStyles.black,
  },
  text_regular_white: {
    ...BaseStyles.text_default,
    ...BaseStyles.text_regular,
  },
  text_regular_gay: {
    ...BaseStyles.text_default,
    ...BaseStyles.text_regular,
    ...ColorStyles.dedault,
  },
  text_medium_light_blue_24: {
    ...BaseStyles.text_default,
    ...BaseStyles.text_medium_24,
    ...ColorStyles.light_blue,
  },
  text_small_5_16: {
    ...BaseStyles.text_default,
    ...BaseStyles.text_small_5_16,
  },
  text_small_5_14: {
    ...BaseStyles.text_default,
    ...BaseStyles.text_small_5_14,
  },
  text_small_light_blue_5_14: {
    ...BaseStyles.text_default,
    ...BaseStyles.text_small_5_14,
    ...ColorStyles.light_blue,
  },
  text_medium_24: {
    ...BaseStyles.text_default,
    ...BaseStyles.text_medium_24,
  },
  text_medium_gray_24: {
    ...BaseStyles.text_default,
    ...BaseStyles.text_medium_24,
    ...ColorStyles.dark_gray,
  },
  text_medium_30: {
    ...BaseStyles.text_default,
    ...BaseStyles.text_medium_30,
  },
  text_medium_light_blue_18: {
    ...BaseStyles.text_default,
    ...BaseStyles.text_medium_18,
    ...ColorStyles.light_blue,
  },
  text_large_7_white: {
    ...BaseStyles.text_default,
    ...BaseStyles.text_medium_7_22,
  },
  text_regular_27: {
    ...BaseStyles.text_default,
    ...BaseStyles.text_medium_27,
  },
};

// Legacy CustomText types, mapped onto the token type scale (theme/tokens.ts)
// so every screen uses the same five sizes and the system font.
const t = tokens.type;
const c = tokens.colors;

export const styles = StyleSheet.create({
  text_large_64: {fontSize: 48, lineHeight: 56, fontWeight: '700', color: c.text},
  text_large_20: {...t.body, fontWeight: '600', color: c.text},
  text_xLarge: {...t.heading, color: c.text, textAlign: 'center'},
  text_medium_30: {...t.title, color: c.text},
  text_medium_24: {...t.heading, color: c.text},
  text_medium_20: {...t.body, color: c.text},
  text_regular_24: {...t.heading, fontWeight: '400', color: c.text},
  text_regular_20: {...t.body, color: c.text},
  text_medium_18: {...t.body, color: c.textMuted},
  text_medium_16: {...t.label, fontWeight: '400', color: c.textMuted},
  text_medium_14: {...t.caption, color: c.textMuted},
  text_medium_10: {...t.caption, color: c.textMuted},
});

export const colors = StyleSheet.create({
  blue: {color: c.primary},
  white: {color: c.text},
  black: {color: BLACK_COLOR},
  red: {color: c.sos},
});
