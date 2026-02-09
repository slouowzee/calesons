import { View, Text, YStack, XStack, Button, H4, Card, Separator, Spinner } from 'tamagui';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import appColors from '../../lib/theme';
import { useState } from 'react';
import useCartStore from '../../lib/cartStore';
import useAuthStore from '../../lib/authStore';
import { Alert, TouchableOpacity } from 'react-native';

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, setAuth, token } = useAuthStore();
  const total = getTotal();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePayment = (method: 'paypal' | 'card') => {
    setLoading(method);
    
    // Simulation du délai de traitement bancaire
    setTimeout(() => {
      setLoading(null);
      
      // Simulation locale de création de billets pour "Mon Espace"
      if (user) {
        const newBillets = [...(user.billets || [])];
        items.forEach(item => {
          for (let i = 0; i < item.quantity; i++) {
            newBillets.push({
              ID_BILLET: Math.floor(Math.random() * 1000000),
              IDMANIF: item.id,
              NOMFESTIVAL: item.name,
              NOMTYPEBILLET: item.type,
              DATESESSION: item.sessionDate,
              HEUREDEBSESSION: item.sessionTime,
              QRCODE: `TICKET-${item.id}-${Math.floor(Math.random() * 10000)}`
            });
          }
        });
        setAuth({ ...user, billets: newBillets }, token || '');
      }

      Alert.alert(
        "Paiement Réussi",
        `Merci ! Votre paiement par ${method === 'paypal' ? 'PayPal' : 'Carte Bancaire'} a été validé.`,
        [
          { 
            text: "Voir mes billets", 
            onPress: () => {
              clearCart();
              router.push('/login');
            } 
          }
        ]
      );
    }, 2500);
  };

  return (
    <View flex={1} backgroundColor={appColors.background} paddingTop={insets.top}>
      <XStack p="$4" alignItems="center" gap="$3">
        <Button size="$3" circular iconAfter={<FontAwesome name="chevron-left" />} onPress={() => router.back()} />
        <H4 fontWeight="800">Paiement</H4>
      </XStack>

      <YStack p="$5" gap="$6" flex={1}>
        <Card elevate p="$4" backgroundColor="white" borderRadius="$4" gap="$2">
          <Text color="$gray10" fontSize={14} fontWeight="600" textTransform="uppercase">Récapitulatif</Text>
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={24} fontWeight="800">Total à payer</Text>
            <Text fontSize={24} fontWeight="800" color={appColors.primary}>{total} €</Text>
          </XStack>
        </Card>

        <YStack gap="$4">
          <Text fontWeight="700" fontSize={18}>Choisir un mode de paiement</Text>
          
          <TouchableOpacity onPress={() => !loading && handlePayment('card')}>
            <Card elevate p="$4" backgroundColor="white" borderRadius="$4" borderWidth={2} borderColor={loading === 'card' ? appColors.primary : "$gray3"}>
              <XStack justifyContent="space-between" alignItems="center">
                <XStack alignItems="center" gap="$4">
                  <View backgroundColor="$blue1" p="$3" borderRadius="$3">
                    <FontAwesome name="credit-card" size={24} color={appColors.primary} />
                  </View>
                  <YStack>
                    <Text fontWeight="700" fontSize={16}>Carte Bancaire</Text>
                    <Text fontSize={12} color="$gray10">Visa, Mastercard, AMEX</Text>
                  </YStack>
                </XStack>
                {loading === 'card' ? <Spinner color={appColors.primary} /> : <FontAwesome name="chevron-right" size={16} color="$gray8" />}
              </XStack>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => !loading && handlePayment('paypal')}>
            <Card elevate p="$4" backgroundColor="white" borderRadius="$4" borderWidth={2} borderColor={loading === 'paypal' ? "#003087" : "$gray3"}>
              <XStack justifyContent="space-between" alignItems="center">
                <XStack alignItems="center" gap="$4">
                  <View backgroundColor="#f2f2f2" p="$3" borderRadius="$3">
                    <FontAwesome name="paypal" size={24} color="#003087" />
                  </View>
                  <YStack>
                    <Text fontWeight="700" fontSize={16}>PayPal</Text>
                    <Text fontSize={12} color="$gray10">Paiement rapide et sécurisé</Text>
                  </YStack>
                </XStack>
                {loading === 'paypal' ? <Spinner color="#003087" /> : <FontAwesome name="chevron-right" size={16} color="$gray8" />}
              </XStack>
            </Card>
          </TouchableOpacity>
        </YStack>

        <YStack flex={1} />
        
        <Text textAlign="center" color="$gray9" fontSize={12} paddingBottom={insets.bottom + 20}>
          <FontAwesome name="lock" /> Vos transactions sont cryptées et sécurisées.
        </Text>
      </YStack>
    </View>
  );
}
