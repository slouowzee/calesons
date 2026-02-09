import { View, Text, YStack, ScrollView, H4, Button } from 'tamagui';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import appColors from '../../lib/theme';
import { FontAwesome } from '@expo/vector-icons';

export default function CGUScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View flex={1} backgroundColor={appColors.background} paddingTop={insets.top}>
      <XStack p="$4" alignItems="center" gap="$3">
        <Button size="$3" circular icon={<FontAwesome name="chevron-left" />} onPress={() => router.back()} />
        <H4 fontWeight="800">CGU</H4>
      </XStack>

      <ScrollView p="$4" contentContainerStyle={{ paddingBottom: 60 }}>
        <YStack gap="$4">
          <Text fontWeight="800" fontSize={18}>1. Présentation de l'application</Text>
          <Text color="$gray11">
            L'application Calésons Festival permet aux utilisateurs de consulter la programmation du festival, d'acheter des billets et de gérer leurs réservations via un espace personnel.
          </Text>

          <Text fontWeight="800" fontSize={18}>2. Propriété Intellectuelle</Text>
          <Text color="$gray11">
            Tous les contenus présents sur cette application (logos, textes, visuels) sont la propriété exclusive du Calésons Festival. Toute reproduction est interdite sans accord préalable.
          </Text>

          <Text fontWeight="800" fontSize={18}>3. Utilisation du service</Text>
          <Text color="$gray11">
            L'utilisateur s'engage à fournir des informations exactes lors de la création de son compte. L'accès au festival est soumis à la présentation d'un billet valide (QR Code).
          </Text>

          <Text fontWeight="800" fontSize={18}>4. Responsabilité</Text>
          <Text color="$gray11">
            Le Calésons Festival ne saurait être tenu responsable des pannes de réseau mobile empêchant l'accès au QR Code à l'entrée. Il est conseillé de télécharger son billet à l'avance.
          </Text>
        </YStack>
      </ScrollView>
    </View>
  );
}

import { XStack } from 'tamagui';
