import { View, Text, YStack, XStack, ScrollView, H4, Button } from 'tamagui';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import appColors from '../../lib/theme';
import { FontAwesome } from '@expo/vector-icons';

export default function PrivacyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View flex={1} backgroundColor={appColors.background} paddingTop={insets.top}>
      <XStack p="$4" alignItems="center" gap="$3">
        <Button size="$3" circular icon={<FontAwesome name="chevron-left" />} onPress={() => router.back()} />
        <H4 fontWeight="800">Confidentialité</H4>
      </XStack>

      <ScrollView p="$4" contentContainerStyle={{ paddingBottom: 60 }}>
        <YStack gap="$4">
          <Text fontWeight="800" fontSize={18}>1. Collecte des données</Text>
          <Text color="$gray11">
            Nous collectons les données nécessaires à la gestion de vos commandes : Nom, Prénom, Email, Téléphone et historique d'achats.
          </Text>

          <Text fontWeight="800" fontSize={18}>2. Utilisation des données</Text>
          <Text color="$gray11">
            Vos données sont utilisées exclusivement pour le bon fonctionnement de l'application, l'envoi de vos billets par email et la sécurité des accès au festival.
          </Text>

          <Text fontWeight="800" fontSize={18}>3. Conservation</Text>
          <Text color="$gray11">
            Vos informations personnelles sont conservées pendant toute la durée de vie de votre compte utilisateur. Vous pouvez demander la suppression de votre compte à tout moment.
          </Text>

          <Text fontWeight="800" fontSize={18}>4. Vos droits (RGPD)</Text>
          <Text color="$gray11">
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour toute demande, contactez notre support via l'onglet dédié.
          </Text>
        </YStack>
      </ScrollView>
    </View>
  );
}
