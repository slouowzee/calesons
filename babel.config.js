module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui', '@tamagui/core'],
          config: './tamagui.config.ts',
          logTimings: true,
          disableExtraction: true,
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
