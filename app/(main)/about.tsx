import { View, Text, YStack, XStack, ScrollView, H4, Button, Image } from 'tamagui';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import appColors from '../../lib/theme';
import { FontAwesome } from '@expo/vector-icons';

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View flex={1} backgroundColor={appColors.background} paddingTop={insets.top}>
      <XStack p="$4" alignItems="center" gap="$3">
        <Button size="$3" circular icon={<FontAwesome name="chevron-left" />} onPress={() => router.back()} />
        <H4 fontWeight="800">À propos</H4>
      </XStack>

      <ScrollView p="$4" contentContainerStyle={{ paddingBottom: 60 }}>
        <YStack gap="$5" alignItems="center">
          <View width={120} height={120} backgroundColor={appColors.primary} borderRadius="$6" alignItems="center" justifyContent="center" elevate>
             <FontAwesome name="music" size={60} color="white" />
          </View>
          
          <YStack gap="$2" alignItems="center">
            <Text fontSize={24} fontWeight="900" color={appColors.primary}>Calésons Festival</Text>
            <Text color="$gray10">Édition 2026</Text>
          </YStack>

          <Text textAlign="center" lineHeight={24} color="$gray11">
            Le Calésons Festival est né de la passion pour la musique et la culture locale. Depuis 2020, nous réunissons des milliers de festivaliers autour d'une programmation éclectique allant du rock à l'électro, en passant par des ateliers artistiques et des conférences engagées.
          </Text>

          <Text textAlign="center" lineHeight={24} color="$gray11">
            Notre mission est de proposer une expérience immersive et conviviale tout en respectant notre charte éco-responsable.
          </Text>

          <View width="100%" height={2} backgroundColor="$gray3" marginVertical="$4" />

          <YStack gap="$2" width="100%">
            <XStack justifyContent="space-between">
              <Text fontWeight="700">Développement</Text>
              <Text color="$gray10">L'Équipe Calésons</Text>
            </XStack>
            <XStack justifyContent="space-between">
              <Text fontWeight="700">Design</Text>
              <Text color="$gray10">Studio Créatif B6</Text>
            </XStack>
            <XStack justifyContent="space-between">
              <Text fontWeight="700">Partenaires</Text>
              <Text color="$gray10">Ville de Calésons, Traefik, Expo</Text>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </View>
  );
}
