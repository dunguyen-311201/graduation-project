import {
  BLACK_COLOR,
  DARK_GRAY_COLOR,
  GRAY_COLOR,
  LIGHT_BLUE_COLOR,
  TEXT_COLOR,
  WHITE_COLOR,
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
