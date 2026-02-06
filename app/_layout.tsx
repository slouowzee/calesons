import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { TamaguiProvider, Theme } from 'tamagui';
import tamaguiConfig from '../tamagui.config';
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat.ttf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        <SafeAreaProvider style={{ flex: 1 }}>
          <Theme name="light">
            <Slot />
          </Theme>
        </SafeAreaProvider>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
