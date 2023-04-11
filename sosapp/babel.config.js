module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@components': './src/components',
          '@enums': './src/enums',
          '@theme': './src/theme',
          '@assets': './src/assets',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@constants': './src/constants',
          '@types': './src/types',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@context': './src/context',
          '@src': './src',
        },
      },
    ],
    ['babel-plugin-react-docgen-typescript', {exclude: 'node_modules'}],
    [
      'react-native-reanimated/plugin',
      {
        relativeSourceLocation: true,
      },
    ],
  ],
};
