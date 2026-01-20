/**
 * Styled Text Component
 *
 * Provides specialized text components, such as monospace text.
 */
import { Text, TextProps } from './Themed';

/**
 * MonoText Component
 *
 * Renders text using the 'SpaceMono' font family.
 *
 * @param {TextProps} props - The component props.
 * @returns {JSX.Element} The rendered text component.
 */
export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />;
}
