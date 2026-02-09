import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { TamaguiProvider, Theme } from 'tamagui';
import tamaguiConfig from '../tamagui.config';
import { Slot, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useAuthStore from '../lib/authStore';
import * as SecureStore from 'expo-secure-store';
import authApi from '../lib/authApi';
import { Platform } from 'react-native';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function AuthGuard() {
  const { isLoggedIn, setAuth, logout } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      if (Platform.OS === 'web') {
        setIsReady(true);
        return;
      }
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        if (token) {
          try {
            const user = await authApi.getMe(token);
            if (user) {
              setAuth(user, token);
            } else {
              await logout();
            }
          } catch (apiError) {
            console.warn("Auth token invalid or network error", apiError);
            await logout();
          }
        }
      } catch (e) {
        console.error("SecureStore error", e);
      } finally {
        setIsReady(true);
      }
    };
    initAuth();
  }, []);

  if (!isReady) {
    return null; // On attend que l'auth soit vérifiée avant de rendre quoi que ce soit
  }

  return <Slot />;
}

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
            <AuthGuard />
          </Theme>
        </SafeAreaProvider>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
