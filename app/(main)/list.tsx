import { View, Text, YStack, Card, Spinner, ScrollView, H3, XStack, Image, Button } from 'tamagui';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import appColors from '../../lib/theme';
import { FlatList, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import useCartStore from '../../lib/cartStore';
import useAuthStore from '../../lib/authStore';

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [addedMap, setAddedMap] = useState<{[key: string]: boolean}>({});
  const { items, addItem } = useCartStore();
  const { isLoggedIn, user } = useAuthStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const isAdmin = !!(user?.is_admin || (user as any)?.ROLEPERS === 'admin');

  const handleAddToCart = (item: any) => {
    if (!isLoggedIn) {
      Alert.alert("Connexion requise", "Veuillez vous connecter pour ajouter au panier.");
      return;
    }

    const session = item._relevantSession || item.sessions?.[0];
    const eventType = getEventType(item);
    const itemId = (item.IDMANIF || item.id).toString();

    addItem({
      id: item.IDMANIF || item.id,
      name: item.NOMMANIF || item.nom,
      price: item.PRIXMANIF || item.prix || 0,
      type: eventType,
      quantity: 1,
      sessionId: session?.IDSESSION,
      sessionDate: session?.DATESESSION,
      sessionTime: session?.HEUREDEBSESSION,
      image: item.AFFICHEMANIF
    });

    setAddedMap(prev => ({ ...prev, [itemId]: true }));
    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [itemId]: false }));
    }, 2000);
  };

  const tabs = [
    { label: '13 Août', value: '08-13' },
    { label: '14 Août', value: '08-14' },
    { label: '15 Août', value: '08-15' },
    { label: '16 Août', value: '08-16' },
  ];

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await api.get('/v1/manifestations');
      return response.data.data;
    },
  });

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    // On pré-calcule la session pertinente pour chaque événement pour le tri
    const eventsWithBestSession = events.map((event: any) => {
      let bestSession = null;
      
      const sessions = event.sessions ? [...event.sessions] : [];

      if (selectedDay) {
        // Match indépendant de l'année (cherche "08-13" dans la date)
        bestSession = sessions.find((s: any) => {
          const rawDate = String(s.DATESESSION || s.date || "");
          return rawDate.includes(selectedDay);
        });
      } else {
        bestSession = sessions.sort((s1: any, s2: any) => {
          const d1 = `${s1.DATESESSION || s1.date} ${s1.HEUREDEBSESSION || '00:00'}`;
          const d2 = `${s2.DATESESSION || s2.date} ${s2.HEUREDEBSESSION || '00:00'}`;
          return d1.localeCompare(d2);
        })[0];
      }
      return { ...event, _relevantSession: bestSession };
    });

    // Tri Final : Chronologique par rapport à la session sélectionnée (ou la première)
    const sorted = eventsWithBestSession.sort((a: any, b: any) => {
      const sA = a._relevantSession;
      const sB = b._relevantSession;
      
      const valA = sA ? `${sA.DATESESSION || sA.date} ${sA.HEUREDEBSESSION || '00:00'}` : '9999-12-31';
      const valB = sB ? `${sB.DATESESSION || sB.date} ${sB.HEUREDEBSESSION || '00:00'}` : '9999-12-31';
      
      return valA.localeCompare(valB);
    });

    if (!selectedDay) return sorted;

    // Filtre : On ne garde que ceux qui ont une session correspondant au jour cliqué
    return sorted.filter((e: any) => e._relevantSession !== null && e._relevantSession !== undefined);
  }, [events, selectedDay]);

  const handleToggle = (value: string) => {
    setSelectedDay(prev => prev === value ? null : value);
  };

  const getEventType = (item: any) => {
    if (item.concert) return 'Concert';
    if (item.conference) return 'Conférence';
    if (item.atelier) return 'Atelier';
    return item.TYPE_MANIFESTATION || 'Événement';
  };

  const getFirstSession = (item: any) => {
    const session = item._relevantSession || item.sessions?.[0];
    if (session) {
      // On gère le fait que 'lieux' puisse être un tableau (via relation) ou un objet unique
      const lieuData = Array.isArray(session.lieux) ? session.lieux[0] : session.lieux;
      
      const lieuName = lieuData?.NOMLIEUX || lieuData?.nom || 'Lieu à confirmer';
      
      const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        return timeStr.substring(0, 5); // "20:00:00" -> "20:00"
      };

      return {
        date: session.DATESESSION || session.date,
        heureDebut: formatTime(session.HEUREDEBSESSION),
        heureFin: formatTime(session.HEUREFINSESSION),
        lieu: lieuName,
        adresse: lieuData?.ADRESSELIEUX
      };
    }
    return null;
  };

  if (isLoading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" color={appColors.primary} />
      </View>
    );
  }

  return (
    <YStack flex={1} backgroundColor={appColors.background} paddingHorizontal="$4" gap="$2" paddingTop={insets.top}>
      <XStack justifyContent="space-between" alignItems="center" marginTop="$2">
        <H3 color={appColors.text} fontWeight="800">Événements</H3>
      </XStack>
      
      <XStack 
        gap="$2" 
        marginBottom="$4"
        justifyContent="space-between"
        width="100%"
        marginTop="$2"
      >
        {tabs.map((tab) => (
          <TouchableOpacity 
            key={tab.value} 
            onPress={() => handleToggle(tab.value)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: selectedDay === tab.value ? appColors.primary : 'white',
              borderWidth: 1,
              borderColor: selectedDay === tab.value ? appColors.primary : '$gray4',
              justifyContent: 'center',
              alignItems: 'center',
              height: 44
            }}
          >
            <Text 
              color={selectedDay === tab.value ? 'white' : '$gray11'} 
              fontWeight={selectedDay === tab.value ? '700' : '500'}
              fontSize={12}
              textAlign="center"
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </XStack>
      
      <FlatList
        data={filteredEvents}
        contentContainerStyle={{ paddingBottom: 150 }}
        keyExtractor={(item) => (item.IDMANIF || item.id || Math.random()).toString()}
        renderItem={({ item }) => {
          const sessionInfo = getFirstSession(item);
          const eventType = getEventType(item);
          
          return (
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => router.push({
                pathname: '/event-detail',
                params: { id: item.IDMANIF || item.id }
              })}
            >
              <Card elevate p="$0" borderRadius="$4" marginBottom="$4" backgroundColor="white" borderWidth={1} borderColor="$gray4" overflow="hidden">
                {/* Image d'illustration si présente */}
                {item.AFFICHEMANIF && (
                  <View height={150} width="100%" backgroundColor="$gray3">
                    <Image 
                      source={{ uri: `${process.env.EXPO_PUBLIC_STORAGE_URL}/${item.AFFICHEMANIF}` }} 
                      width="100%" 
                      height="100%"
                      resizeMode="cover"
                    />
                    <View position="absolute" top="$2" right="$2" backgroundColor={appColors.primary} paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2">
                      <Text color="white" fontSize={11} fontWeight="700">{eventType.toUpperCase()}</Text>
                    </View>
                  </View>
                )}

                <YStack paddingHorizontal="$4" paddingTop="$4" paddingBottom="$5" gap="$3">
                  <XStack justifyContent="space-between" alignItems="flex-start">
                    <YStack flex={1} gap="$1" paddingRight="$2">
                      <Text fontSize={18} fontWeight="700" color={appColors.primary} lineHeight={22}>
                        {item.NOMMANIF || item.nom}
                      </Text>
                      {!item.AFFICHEMANIF && (
                        <Text color="$gray10" fontSize={12} fontWeight="600" textTransform="uppercase">
                          {eventType}
                        </Text>
                      )}
                    </YStack>
                    <Text fontSize={18} fontWeight="800" color={appColors.secondary}>
                      {item.PRIXMANIF || item.prix || 0}€
                    </Text>
                  </XStack>

                  {(item.RESUMEMANIF || item.description) && (
                    <Text color="$gray11" fontSize={14} numberOfLines={2}>
                      {item.RESUMEMANIF || item.description}
                    </Text>
                  )}

                  <YStack gap="$2" marginTop="$1" paddingTop="$3" borderTopWidth={1} borderColor="$gray2">
                    <XStack justifyContent="space-between" alignItems="flex-start">
                      <XStack alignItems="center" gap="$2" flex={1}>
                        <FontAwesome name="calendar" size={14} color={appColors.primary} width={16} />
                        <YStack>
                          <Text fontSize={12} color="$gray10">
                            {sessionInfo?.date 
                              ? new Date(sessionInfo.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
                              : 'Date à venir'}
                          </Text>
                          {sessionInfo?.heureDebut && (
                            <Text fontSize={11} color="$gray8" fontWeight="600">
                              {sessionInfo.heureDebut} {sessionInfo.heureFin ? `- ${sessionInfo.heureFin}` : ''}
                            </Text>
                          )}
                        </YStack>
                      </XStack>

                      {item.NBMAXPARTICIPANTMANIF && (
                        <XStack alignItems="center" gap="$2">
                          <FontAwesome name="users" size={14} color={item.available_places !== undefined && item.available_places <= 0 ? '#dc2626' : appColors.primary} />
                          <Text fontSize={12} color={item.available_places !== undefined && item.available_places <= 0 ? '#dc2626' : '$gray10'} fontWeight="600">
                            {item.available_places !== undefined 
                              ? (item.available_places <= 0 ? 'Complet' : `${item.available_places} p.`)
                              : `${item.NBMAXPARTICIPANTMANIF} p.`}
                          </Text>
                        </XStack>
                      )}
                    </XStack>

                    <XStack alignItems="flex-start" gap="$2">
                      <FontAwesome name="map-marker" size={16} color={appColors.primary} width={16} marginTop={2} />
                      <YStack flex={1}>
                        <Text fontSize={12} color="$gray10" fontWeight="600">
                          {sessionInfo?.lieu || 'Lieu non défini'}
                        </Text>
                        {sessionInfo?.adresse && (
                          <Text fontSize={11} color="$gray8">
                            {sessionInfo.adresse}
                          </Text>
                        )}
                      </YStack>
                    </XStack>
                    
                    {!isAdmin && (
                    <Button 
                      size="$3" 
                      backgroundColor={addedMap[(item.IDMANIF || item.id).toString()] ? "$green8" : appColors.primary} 
                      color="white" 
                      borderRadius="$3"
                      onPress={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      icon={<FontAwesome name={addedMap[(item.IDMANIF || item.id).toString()] ? "check" : "cart-plus"} size={14} color="white" />}
                    >
                      {addedMap[(item.IDMANIF || item.id).toString()] ? "Ajouté !" : "Panier"}
                    </Button>
                    )}
                  </YStack>
                </YStack>
              </Card>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View p="$10" alignItems="center">
            <Text color="$gray10">Aucun événement trouvé</Text>
          </View>
        }
      />
    </YStack>
  );
}
