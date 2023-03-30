import {StyleSheet} from 'react-native';

const a = 'p10-m8-fw600-fs64';

enum STYLE {
  'fw6_fs5' = 'font-weight-600-font-wize-20',
  'fs5' = 'font-weight-400-font-size-20',
  'fs16' = 'font-weight-400-font-size-64',
  'fw7_fs16' = 'font-weight-700-font-size-64',
  'p4' = 'padding-16',
}

const styles = StyleSheet.create({
  [STYLE.fw6_fs5]: {
    fontSize: 20,
    fontWeight: '600',
  },
  [STYLE.fs5]: {
    fontSize: 20,
    fontWeight: '400',
  },
  [STYLE.fw7_fs16]: {
    fontSize: 64,
    fontWeight: '600',
  },
  [STYLE.fs16]: {
    fontSize: 64,
    fontWeight: '400',
  },
});

export const m_d = (keys: (keyof typeof STYLE)[]) => {
  const _styles = keys.map(key => styles[STYLE[key]]);
  return _styles;
};
