import {StyleSheet} from 'react-native';

export enum ERule {
  'text' = 'text',
  'p' = 'padding',
  'm' = 'margin',
}

const a = 'text-red-500';

const fonts = ['400', '500', '600', '700', '800', '900'];
const colors = ['red', 'green', 'yellow'];
const types = ['text'];

const u: string[] = [];

function general(...args: string[][]) {}

general(fonts, colors, types);

fonts.forEach(font => {
  colors.forEach(color => {
    types.forEach(ty => {
      const ti = `${ty}-${color}-${font}`;
      u.push(ti);
    });
  });
});

export function detect(s: string) {
  if (!s) {
    return;
  }
  const rules = s.split(' ');
  const crule = rules.map(rule => rule.split('-'));
  return crule;
}
