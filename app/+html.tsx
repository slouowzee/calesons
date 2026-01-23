/**
 * Root HTML
 *
 * Configures the root HTML structure for web builds.
 * Sets universal styles and responsive background colors.
 */
import { ScrollViewStyleReset } from 'expo-router/html';
import appColors from '../lib/theme';

/**
 * Root Component
 *
 * Defines the HTML structure for the application on web.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child elements to render.
 * @returns {JSX.Element} The rendered HTML structure.
 */
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: ${appColors.background};
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: ${appColors.backgroundDark};
  }
}`;
