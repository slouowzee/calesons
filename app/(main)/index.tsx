import { View, Text, YStack, Card, H3, Paragraph, Spinner, XStack, ScrollView, Image, Button } from 'tamagui';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import appColors from '../../lib/theme';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import useAuthStore from '../../lib/authStore';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();

  const { data: events, isLoading } = useQuery({
    queryKey: ['next-events'],
    queryFn: async () => {
      const response = await api.get('/v1/manifestations');
      const allEvents = response.data.data;
      // On trie par date de la première session pour avoir les "prochains"
      return allEvents
        .sort((a: any, b: any) => {
          const dA = a.sessions?.[0]?.DATESESSION || '9999';
          const dB = b.sessions?.[0]?.DATESESSION || '9999';
          return dA.localeCompare(dB);
        })
        .slice(0, 3);
    },
  });

  const tickets = user?.billets || [];

  if (isLoading) {
    return (
      <View flex={1} backgroundColor={appColors.background} justifyContent="center" alignItems="center">
        <Spinner size="large" color={appColors.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      flex={1} 
      backgroundColor={appColors.background} 
      paddingTop={insets.top + 20} 
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <YStack paddingHorizontal="$4" gap="$6">
        {/* Section 3 Prochains Événements - MAINTENANT EN PREMIER */}
        <YStack gap="$4">
          <H3 color={appColors.text} fontWeight="800">À ne pas manquer</H3>
          <YStack gap="$4">
            {events?.map((item: any) => (
              <TouchableOpacity 
                key={item.IDMANIF || item.id}
                onPress={() => router.push({ pathname: '/event-detail', params: { id: item.IDMANIF || item.id } })}
              >
                <Card elevate flexDirection="row" backgroundColor="white" borderRadius="$4" overflow="hidden" height={100} borderWidth={1} borderColor="$gray3">
                  <View width={100} height="100%" backgroundColor="$gray2">
                    {item.AFFICHEMANIF ? (
                      <Image 
                        source={{ uri: `https://ap4-site-web-b6bf7x-24c7b9-192-168-117-32.traefik.me/storage/affiches/${item.AFFICHEMANIF}` }} 
                        width="100%" 
                        height="100%"
                      />
                    ) : (
                      <View flex={1} alignItems="center" justifyContent="center">
                        <FontAwesome name="image" size={24} color="$gray8" />
                      </View>
                    )}
                  </View>
                  <YStack flex={1} p="$3" justifyContent="center" gap="$1">
                    <Text fontWeight="800" fontSize={16} color={appColors.text} numberOfLines={1}>{item.NOMMANIF || item.nom}</Text>
                    <XStack alignItems="center" gap="$4">
                      <XStack alignItems="center" gap="$1">
                        <FontAwesome name="calendar" size={12} color={appColors.primary} />
                        <Text fontSize={12} color="$gray10">
                          {item.sessions?.[0]?.DATESESSION 
                            ? new Date(item.sessions[0].DATESESSION).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                            : 'Bientôt'}
                        </Text>
                      </XStack>
                      <Text fontWeight="700" color={appColors.secondary}>{item.PRIXMANIF || item.prix || 0}€</Text>
                    </XStack>
                  </YStack>
                </Card>
              </TouchableOpacity>
            ))}
          </YStack>
          
          <Button 
            marginTop="$2" 
            backgroundColor={appColors.primary} 
            color="white" 
            borderRadius="$4"
            onPress={() => router.push('/list')}
          >
            Voir toute la programmation
          </Button>
        </YStack>

        {/* Section Billets - MAINTENANT EN DEUXIÈME */}
        <YStack gap="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <H3 color={appColors.text} fontWeight="800">Mes Billets</H3>
            {tickets.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text color={appColors.primary} fontWeight="700">Voir tout</Text>
              </TouchableOpacity>
            )}
          </XStack>
          
          {isLoggedIn && tickets.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 15 }}>
              {tickets.slice(0, 3).map((ticket: any, idx: number) => (
                <Card key={idx} width={260} elevate p="$4" backgroundColor="white" borderRadius="$4" borderWidth={1} borderColor="$gray3">
                  <YStack gap="$2">
                    <XStack justifyContent="space-between" alignItems="center">
                      <View backgroundColor="$blue1" px="$2" py="$1" borderRadius="$2">
                        <Text fontSize={10} fontWeight="800" color={appColors.primary}>TICKET</Text>
                      </View>
                      <FontAwesome name="qrcode" size={16} color={appColors.primary} />
                    </XStack>
                    <Text fontWeight="800" fontSize={16} numberOfLines={1}>{ticket.NOMFESTIVAL || 'Événement'}</Text>
                    <XStack alignItems="center" gap="$2">
                      <FontAwesome name="calendar" size={12} color="$gray10" />
                      <Text fontSize={12} color="$gray10">
                        {ticket.DATESESSION ? new Date(ticket.DATESESSION).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'À venir'}
                      </Text>
                    </XStack>
                  </YStack>
                </Card>
              ))}
            </ScrollView>
          ) : (
            <Card elevate p="$4" backgroundColor="white" borderRadius="$3" borderStyle="dashed" borderWidth={1} borderColor="$gray8">
              <TouchableOpacity onPress={() => router.push('/list')}>
                <YStack alignItems="center" py="$2" gap="$2">
                  <Text color="$gray10" textAlign="center">Aucun billet pour le moment.</Text>
                  <Text color={appColors.primary} fontWeight="700">Découvrir les événements</Text>
                </YStack>
              </TouchableOpacity>
            </Card>
          )}
        </YStack>
      </YStack>
    </ScrollView>
  );
}
