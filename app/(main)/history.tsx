import { useRouter } from 'expo-router';
import { View, Text, YStack, Card, H4, XStack, Paragraph, Spinner } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import appColors from '../../lib/theme';
import { FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import authApi from '../../lib/authApi';
import useAuthStore from '../../lib/authStore';

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuthStore();

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user-history'],
    queryFn: async () => {
      if (!token) return null;
      return await authApi.getMe(token);
    },
    enabled: !!token
  });

  const history = userData?.reservations || [];

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
          <Text fontSize={12} color="$gray10">{history.length} commande(s) trouvée(s)</Text>
        </YStack>
      </XStack>

      <FlatList
        data={history}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        keyExtractor={(item: any) => (item.ID_RESERVATION || item.id || Math.random()).toString()}
        renderItem={({ item }) => (
          <Card elevate p="$4" borderRadius="$4" marginBottom="$3" backgroundColor="white" borderWidth={1} borderColor="$gray4">
            <XStack justifyContent="space-between" alignItems="center">
              <YStack gap="$1" flex={1}>
                <Text fontWeight="700" fontSize={16}>
                  {item.festival?.NOMFESTIVAL || item.NOMFESTIVAL || 'Commande #' + (item.ID_RESERVATION || item.id)}
                </Text>
                <Text color="$gray10" fontSize={12}>
                  {new Date(item.DATE_RESERVATION || item.created_at).toLocaleDateString()}
                </Text>
              </YStack>
              <YStack alignItems="flex-end">
                <Text fontWeight="700" color={appColors.primary}>
                  {item.MONTANT_RESERVATION || item.total || item.prix || '0'}€
                </Text>
                <View 
                  backgroundColor={item.PAYE ? "$green2" : "$orange2"} 
                  px="$2" 
                  py="$0.5"
                  borderRadius="$2"
                >
                  <Text 
                    color={item.PAYE ? "$green10" : "$orange10"} 
                    fontSize={10} 
                    fontWeight="600"
                  >
                    {item.PAYE ? 'Payé' : 'En attente'}
                  </Text>
                </View>
              </YStack>
            </XStack>
          </Card>
        )}
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
