import { config as defaultConfig } from '@tamagui/config/v3'
import { createFont, createTamagui } from 'tamagui'
import appColors from './lib/theme' // central theme colors

const montserratFont = createFont({
  family: 'Montserrat',
  size: {
    1: 9,
    2: 10,
    3: 11,
    4: 12,
    5: 14,
    6: 18,
    7: 22,
    8: 26,
    9: 34,
    10: 42,
    11: 54,
    12: 70,
    13: 90,
    14: 100,
    15: 110,
    16: 128,
  },
  lineHeight: {
    1: 13,
    2: 14,
    3: 16,
    4: 18,
    5: 22,
    6: 28,
    7: 32,
    8: 40,
    9: 50,
    10: 60,
    11: 72,
    12: 88,
    13: 108,
    14: 120,
    15: 134,
    16: 152,
  },
  weight: {
    1: '300',
    3: '400',
    4: '600',
    6: '800',
  },
  letterSpacing: {
    4: 0,
    8: -1,
  },
  face: {
    300: { normal: 'Montserrat' },
    400: { normal: 'Montserrat' },
    600: { normal: 'Montserrat' },
    800: { normal: 'Montserrat' },
  },
})

const tamaguiConfig = createTamagui({
  ...defaultConfig,
  // extend default tokens so we don't lose required token groups (size, radius, etc.)
  tokens: {
    ...defaultConfig.tokens,
    color: {
      ...(defaultConfig.tokens?.color ?? {}),
      background: appColors.background,
      backgroundDark: appColors.backgroundDark,
      text: appColors.text,
      primary: appColors.primary,
      primaryDark: appColors.primaryDark,
      onPrimary: appColors.onPrimary,
    },
  },
  fonts: {
    ...defaultConfig.fonts,
    heading: montserratFont,
    body: montserratFont,
  },
})

export type AppConfig = typeof tamaguiConfig

declare module 'tamagui' {
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig
