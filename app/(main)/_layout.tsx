import { Slot, useRootNavigationState } from 'expo-router';
import { View } from 'tamagui';
import BottomNav from '../../components/BottomNav';
import appColors from '../../lib/theme';

export default function MainLayout() {
  return (
    <View flex={1} backgroundColor={appColors.background}>
      <Slot />
      <BottomNav />
    </View>
  );
}
