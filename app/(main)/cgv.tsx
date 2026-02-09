import { View, Text, YStack, XStack, ScrollView, H4, Button } from 'tamagui';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import appColors from '../../lib/theme';
import { FontAwesome } from '@expo/vector-icons';

export default function CGVScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View flex={1} backgroundColor={appColors.background} paddingTop={insets.top}>
      <XStack p="$4" alignItems="center" gap="$3">
        <Button size="$3" circular icon={<FontAwesome name="chevron-left" />} onPress={() => router.back()} />
        <H4 fontWeight="800">CGV</H4>
      </XStack>

      <ScrollView p="$4" contentContainerStyle={{ paddingBottom: 60 }}>
        <YStack gap="$4">
          <Text fontWeight="800" fontSize={18}>1. Billetterie</Text>
          <Text color="$gray11">
            Les tarifs des billets sont indiqués en Euros TTC. Le festival se réserve le droit de modifier ses prix à tout moment. Les billets restent valables pour l'événement indiqué sur le titre.
          </Text>

          <Text fontWeight="800" fontSize={18}>2. Paiement</Text>
          <Text color="$gray11">
            Le paiement est exigible immédiatement à la commande. Les paiements par carte bancaire et PayPal sont sécurisés via nos partenaires financiers.
          </Text>

          <Text fontWeight="800" fontSize={18}>3. Annulation et Remboursement</Text>
          <Text color="$gray11">
            Conformément à l'article L221-28 du Code de la consommation, les billets de spectacle ne font pas l'objet d'un droit de rétractation. Ils ne sont ni échangeables ni remboursables, sauf en cas d'annulation totale de l'événement.
          </Text>

          <Text fontWeight="800" fontSize={18}>4. Validation des billets</Text>
          <Text color="$gray11">
            Chaque billet dispose d'un QR code unique qui sera scanné à l'entrée. Une fois scanné, le billet est considéré comme utilisé et ne pourra plus être présenté.
          </Text>
        </YStack>
      </ScrollView>
    </View>
  );
}
