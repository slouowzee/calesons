import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '../tamagui.config';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <Slot />
    </TamaguiProvider>
  );
}
