import { useRouter } from 'expo-router';
import { View, Text, YStack, Card, H4, XStack, Paragraph, Spinner, Separator } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import appColors from '../../lib/theme';
import { FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../../lib/authStore';
import ticketApi from '../../lib/ticketApi';

const PAYMENT_LABELS: Record<number, string> = {
  1: 'CB',
  2: 'PayPal',
  3: 'Virement',
  4: 'Espèces',
  5: 'Chèque',
};

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const clientId = (user as any)?.IDPERS || user?.id;

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['user-history', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const res = await ticketApi.getReservationsByClient(clientId);
      return Array.isArray(res) ? res : (res.data || []);
    },
    enabled: !!clientId,
  });

  // Grouper par date (jour) pour un affichage plus lisible
  const sortedReservations = [...reservations].sort((a: any, b: any) => {
    const da = new Date(a.DATEHEURERESERVATION || a.created_at).getTime();
    const db = new Date(b.DATEHEURERESERVATION || b.created_at).getTime();
    return db - da; // plus récent en premier
  });

  if (isLoading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" backgroundColor={appColors.background}>
        <Spinner size="large" color={appColors.primary} />
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor={appColors.background} paddingTop={insets.top}>
      <XStack p="$4" alignItems="center" gap="$4">
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={20} color={appColors.primary} />
        </TouchableOpacity>
        <YStack>
          <H4 fontWeight="800">Historique des achats</H4>
          <Text fontSize={12} color="$gray10">{sortedReservations.length} réservation(s)</Text>
        </YStack>
      </XStack>

      <FlatList
        data={sortedReservations}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        keyExtractor={(item: any) => (item.IDRESERVATION || item.id || Math.random()).toString()}
        renderItem={({ item }) => {
          const manifName = item.manifestation?.NOMMANIF || 'Événement';
          const date = item.DATEHEURERESERVATION || item.created_at;
          const nbPlaces = item.NBPERSRESERVATION || 1;
          const billet = item.billet || item.billets?.[0];
          const paymentType = billet?.IDTYPEPAIEMENT;
          const paymentLabel = paymentType ? PAYMENT_LABELS[paymentType] || `Type ${paymentType}` : null;
          const isUsed = billet?.INVITEBILLET;
          const prix = item.manifestation?.concert?.PRIXCONCERT || item.manifestation?.conference?.PRIXCONFERENCE || item.MONTANTRESERVATION;

          return (
            <Card elevate p="$4" borderRadius="$4" marginBottom="$3" backgroundColor="white" borderWidth={1} borderColor="$gray4">
              <YStack gap="$2">
                <XStack justifyContent="space-between" alignItems="flex-start">
                  <YStack gap="$1" flex={1}>
                    <Text fontWeight="700" fontSize={16}>{manifName}</Text>
                    <XStack alignItems="center" gap="$2">
                      <FontAwesome name="calendar" size={11} color="#999" />
                      <Text color="$gray10" fontSize={12}>
                        {date ? new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                      </Text>
                    </XStack>
                  </YStack>
                  <View 
                    backgroundColor={isUsed ? "$green2" : "$blue1"} 
                    px="$2" 
                    py="$1"
                    borderRadius="$2"
                  >
                    <Text 
                      color={isUsed ? "$green10" : appColors.primary} 
                      fontSize={10} 
                      fontWeight="700"
                    >
                      {isUsed ? 'UTILISÉ' : 'VALIDE'}
                    </Text>
                  </View>
                </XStack>

                <Separator />

                <XStack justifyContent="space-between" alignItems="center">
                  <XStack gap="$3">
                    <XStack alignItems="center" gap="$1">
                      <FontAwesome name="user" size={11} color="#999" />
                      <Text fontSize={12} color="$gray10">{nbPlaces} place(s)</Text>
                    </XStack>
                    {paymentLabel && (
                      <XStack alignItems="center" gap="$1">
                        <FontAwesome name={paymentType === 2 ? "paypal" : "credit-card"} size={11} color="#999" />
                        <Text fontSize={12} color="$gray10">{paymentLabel}</Text>
                      </XStack>
                    )}
                  </XStack>
                  {prix != null && (
                    <Text fontWeight="700" color={appColors.primary} fontSize={15}>{prix} €</Text>
                  )}
                </XStack>

                {billet?.QRCODEBILLET && (
                  <Text fontSize={10} color="$gray8" fontFamily="$mono">
                    Réf: {billet.QRCODEBILLET.substring(0, 8)}...
                  </Text>
                )}
              </YStack>
            </Card>
          );
        }}
        ListEmptyComponent={
          <YStack p="$10" alignItems="center" gap="$4" marginTop="$10">
            <FontAwesome name="history" size={48} color="$gray8" />
            <Paragraph color="$gray10" textAlign="center">
              Vous n'avez pas encore effectué d'achats.
            </Paragraph>
          </YStack>
        }
      />
    </View>
  );
}
