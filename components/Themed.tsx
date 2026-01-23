/**
 * Themed Components
 *
 * Provides themed Text and View components that adapt to light and dark modes.
 * Also includes a hook for retrieving theme colors.
 */
import { Text as DefaultText, View as DefaultView } from 'react-native';
import appColors from '../lib/theme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

/**
 * useThemeColor Hook (forced light theme)
 * Always uses the light theme colors (black text, white background) unless overridden via props.
 */
export function useThemeColor(props: { light?: string; dark?: string }, _colorName?: string) {
  // Force 'light' theme for now, but use centralized app colors
  const colorFromProps = props.light;
  if (colorFromProps) return colorFromProps;
  if (_colorName === 'background') return appColors.background;
  if (_colorName === 'text') return appColors.text;
  return appColors.text;
}

/**
 * Text Component
 *
 * A themed Text component that changes color based on the current theme.
 *
 * @param {TextProps} props - The component props including optional color overrides.
 * @returns {JSX.Element} The rendered Text component.
 */
export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color, fontFamily: 'Montserrat' }, style]} {...otherProps} />;
}

/**
 * View Component
 *
 * A themed View component that changes background color based on the current theme.
 *
 * @param {ViewProps} props - The component props including optional color overrides.
 * @returns {JSX.Element} The rendered View component.
 */
export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
