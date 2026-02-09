import { View, Text, YStack, XStack, Button, H4, Card, Separator, Spinner } from 'tamagui';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import appColors from '../../lib/theme';
import { useState } from 'react';
import useCartStore from '../../lib/cartStore';
import useAuthStore from '../../lib/authStore';
import { Alert, TouchableOpacity } from 'react-native';
import ticketApi from '../../lib/ticketApi';

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, setAuth, token } = useAuthStore();
  const total = getTotal();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePayment = async (method: 'paypal' | 'card') => {
    setLoading(method);
    
    try {
      if (!user) throw new Error("Utilisateur non connecté");
      const userId = (user as any).IDPERS || user.id;

      // 1. Pour chaque article du panier, créer une réservation
      for (const item of items) {
        const manifId = Number(item.id);
        const quantity = Number(item.quantity);

        console.log(`Création réservation pour manif #${manifId}, client #${userId}, quantité: ${quantity}`);
        
        // CB = 1, PayPal = 2 dans la table TYPEPAIEMENT
        const paymentTypeId = method === 'card' ? 1 : 2;
        const resResponse = await ticketApi.createReservation(manifId, quantity, userId, paymentTypeId);
        
        // Extraction de l'ID de réservation : le backend Laravel renvoie dans data.data ou data
        const resData = resResponse.data || resResponse;
        const reservationId = resData.IDRESERVATION || resData.id || (resResponse.data?.IDRESERVATION);

        if (!reservationId) {
          console.error("Réponse API réservation incomplète:", resResponse);
          throw new Error("Impossible de récupérer l'ID de la réservation.");
        }

        console.log(`Réservation #${reservationId} créée avec succès.`);
      }

      setLoading(null);
      
      Alert.alert(
        "Paiement Réussi",
        `Merci ! Votre paiement par ${method === 'paypal' ? 'PayPal' : 'Carte Bancaire'} a été validé.\nVos billets sont prêts dans votre espace.`,
        [
          { 
            text: "Voir mes billets", 
            onPress: () => {
              clearCart();
              // On redirige vers Mon Espace (login) qui va refresh les billets depuis l'API
              router.push('/login');
            } 
          }
        ]
      );
    } catch (error: any) {
      setLoading(null);
      console.error("Erreur paiement:", error);
      
      // Extraction du message d'erreur de l'API (souvent dans error.response.data.message ou errors)
      const apiMessage = error.response?.data?.message || error.message;
      const apiErrors = error.response?.data?.errors;
      let detailedMsg = apiMessage;
      
      if (apiErrors) {
        detailedMsg += "\n" + Object.values(apiErrors).flat().join("\n");
      }

      Alert.alert("Erreur de paiement", `Une erreur est survenue : \n${detailedMsg}`);
    }
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
