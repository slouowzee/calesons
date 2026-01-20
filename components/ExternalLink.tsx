/**
 * External Link Component
 *
 * A specialized Link component for opening URLs in an external browser or system browser.
 * Handles platform differences between Web and Native.
 */
import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform } from 'react-native';

/**
 * ExternalLink Component
 *
 * Renders a link that opens the `href` in an external browser.
 * On native platforms, it uses `expo-web-browser` to open the link.
 *
 * @param {object} props - The component props.
 * @param {string} props.href - The URL to open.
 * @returns {JSX.Element} The rendered link component.
 */
export function ExternalLink(
  props: Omit<React.ComponentProps<typeof Link>, 'href'> & { href: string }
) {
  return (
    <Link
      target="_blank"
      {...props}
      // @ts-expect-error: External URLs are not typed.
      href={props.href}
      onPress={(e) => {
        if (Platform.OS !== 'web') {
          e.preventDefault();
          WebBrowser.openBrowserAsync(props.href as string);
        }
      }}
    />
  );
}
