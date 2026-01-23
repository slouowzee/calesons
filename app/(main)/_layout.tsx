import { Slot, useRootNavigationState } from 'expo-router';
import { View } from 'tamagui';
import BottomNav from '../../components/BottomNav';

export default function MainLayout() {
  return (
    <View flex={1} backgroundColor="white">
      <Slot />
      <BottomNav />
    </View>
  );
}
