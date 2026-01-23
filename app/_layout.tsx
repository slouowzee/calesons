import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '../tamagui.config';
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        <Slot />
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
