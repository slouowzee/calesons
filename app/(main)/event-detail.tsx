import { View, Text, YStack, XStack, Button, Spinner, ScrollView, Image, H4, Paragraph, Card, AnimatePresence } from 'tamagui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import appColors from '../../lib/theme';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Alert, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import useAuthStore from '../../lib/authStore';
import useCartStore from '../../lib/cartStore';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isLoggedIn } = useAuthStore();
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await api.get(`/v1/manifestations/${id}`);
      return response.data.data;
    },
  });

  const addToCart = (goToCart = false) => {
    if (!isLoggedIn) {
      Alert.alert(
        "Connexion requise",
        "Vous devez être connecté pour réserver un billet.",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Se connecter", onPress: () => router.push('/login') }
        ]
      );
      return;
    }

    const firstSession = event?.sessions?.[0];
    addItem({
      id: event.IDMANIF || event.id,
      name: event.NOMMANIF || event.nom,
      price: event.PRIXMANIF || event.prix || 0,
      type: eventType,
      quantity: 1,
      sessionId: firstSession?.IDSESSION,
      sessionDate: firstSession?.DATESESSION,
      sessionTime: firstSession?.HEUREDEBSESSION,
      image: event.AFFICHEMANIF
    });

    if (goToCart) {
      router.push('/cart');
    } else {
      setAdded(true);
      setShowToast(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" backgroundColor={appColors.background}>
        <Spinner size="large" color={appColors.primary} />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" p="$4">
        <Text color="$gray10">Erreur lors du chargement de l'événement.</Text>
        <Button onPress={() => router.back()} marginTop="$4">Retour</Button>
      </View>
    );
  }

  const sessions = event.sessions || [];
  const eventType = event.concert ? 'Concert' : event.conference ? 'Conférence' : event.atelier ? 'Atelier' : 'Événement';

  return (
    <View flex={1} backgroundColor={appColors.background}>
      {/* Mini Toast Notification */}
      {showToast && (
        <View 
          position="absolute" 
          top={insets.top + 60} 
          left={20} 
          right={20} 
          backgroundColor="$green10" 
          p="$3" 
          borderRadius="$4" 
          flexDirection="row" 
          alignItems="center" 
          gap="$3"
          elevation={10}
          zIndex={100}
        >
          <FontAwesome name="check-circle" size={20} color="white" />
          <Text color="white" fontWeight="700">Article ajouté au panier !</Text>
        </View>
      )}

      {/* Floating Back Button - As requested: bottom left above navbar */}
      <TouchableOpacity 
        onPress={() => router.back()}
        activeOpacity={0.8}
        style={{ 
          position: 'absolute', 
          bottom: insets.bottom + 85, 
          left: 15, 
          backgroundColor: appColors.primary, 
          width: 50,
          height: 50,
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          zIndex: 1000,
          borderWidth: 2,
          borderColor: 'white'
        }}
      >
        <FontAwesome name="chevron-left" size={20} color="white" />
      </TouchableOpacity>

      <ScrollView bounces={false}>
        {/* Header Image */}
        <View height={250} width="100%" backgroundColor="$gray3" position="relative">
          {event.AFFICHEMANIF ? (
            <Image 
              source={{ uri: `https://ap4-site-web-b6bf7x-24c7b9-192-168-117-32.traefik.me/storage/affiches/${event.AFFICHEMANIF}` }} 
              width="100%" 
              height="100%"
            />
          ) : (
            <View flex={1} alignItems="center" justifyContent="center">
              <FontAwesome name="image" size={50} color="$gray8" />
            </View>
          )}

          <View 
            position="absolute" 
            bottom="$4" 
            right="$4" 
            backgroundColor={appColors.primary} 
            px="$3" 
            py="$1" 
            borderRadius="$2"
          >
            <Text color="white" fontWeight="700" fontSize={12}>{eventType.toUpperCase()}</Text>
          </View>
        </View>

        <YStack p="$5" gap="$6" paddingBottom={insets.bottom + 120}>
          <XStack justifyContent="space-between" alignItems="flex-start">
            <YStack flex={1} gap="$2">
              <H4 color={appColors.text} fontWeight="800" fontSize={24}>{event.NOMMANIF || event.nom}</H4>
              <XStack alignItems="center" gap="$2">
                <FontAwesome name="tag" size={16} color={appColors.primary} />
                <Text color={appColors.primary} fontWeight="700" fontSize={18}>
                  {event.PRIXMANIF || event.prix || 0} €
                </Text>
              </XStack>
            </YStack>
          </XStack>

          <YStack gap="$3">
            <Text fontWeight="800" fontSize={18} color={appColors.text} letterSpacing={0.5}>À PROPOS</Text>
            <Paragraph color="$gray11" lineHeight={24} fontSize={15}>
              {event.RESUMEMANIF || event.description || "Aucune description disponible pour cet événement."}
            </Paragraph>
          </YStack>

          <YStack gap="$4">
            <Text fontWeight="800" fontSize={18} color={appColors.text} letterSpacing={0.5}>SESSIONS & LIEUX</Text>
            {sessions.length > 0 ? (
              sessions.map((session: any, index: number) => {
                const lieu = Array.isArray(session.lieux) ? session.lieux[0] : session.lieux;
                return (
                  <Card key={index} elevate p="$4" backgroundColor="white" borderRadius="$4" borderWidth={1} borderColor="$gray3">
                    <YStack gap="$3">
                      <XStack alignItems="center" gap="$3">
                        <View backgroundColor="$blue1" p="$2" borderRadius="$3">
                          <FontAwesome name="calendar" size={16} color={appColors.primary} />
                        </View>
                        <Text fontWeight="700" fontSize={15}>
                          {new Date(session.DATESESSION || session.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </Text>
                      </XStack>
                      <XStack alignItems="center" gap="$3">
                        <View backgroundColor="$blue1" p="$2" borderRadius="$3">
                          <FontAwesome name="clock-o" size={16} color={appColors.primary} />
                        </View>
                        <Text fontSize={15} fontWeight="500">
                          {session.HEUREDEBSESSION?.substring(0, 5)} — {session.HEUREFINSESSION?.substring(0, 5)}
                        </Text>
                      </XStack>
                      <XStack alignItems="flex-start" gap="$3">
                        <View backgroundColor="$blue1" p="$2" borderRadius="$3">
                          <FontAwesome name="map-marker" size={18} color={appColors.primary} />
                        </View>
                        <YStack flex={1}>
                          <Text fontWeight="700" fontSize={15}>{lieu?.NOMLIEUX || lieu?.nom || "Lieu à confirmer"}</Text>
                          {lieu?.ADRESSELIEUX && (
                            <Text fontSize={13} color="$gray10" marginTop="$1">{lieu.ADRESSELIEUX}</Text>
                          )}
                        </YStack>
                      </XStack>
                    </YStack>
                  </Card>
                );
              })
            ) : (
              <Text color="$gray10">Aucune session programmée.</Text>
            )}
          </YStack>

          {event.NBMAXPARTICIPANTMANIF && (
            <XStack backgroundColor="$blue1" p="$4" borderRadius="$4" alignItems="center" gap="$4" borderWidth={1} borderColor="$blue3">
              <FontAwesome name="info-circle" size={20} color="$blue10" />
              <YStack flex={1}>
                <Paragraph fontSize={14} color="$blue10" fontWeight="600">
                  {event.NBPLACESRESTANTES || (event.NBMAXPARTICIPANTMANIF - (event.reservations_count || 0))} places disponibles
                </Paragraph>
                <Paragraph fontSize={12} color="$blue9">
                  Capacité totale : {event.NBMAXPARTICIPANTMANIF} participants
                </Paragraph>
              </YStack>
            </XStack>
          )}

          <XStack gap="$3" marginTop="$4">
            <Button 
              flex={1}
              backgroundColor={added ? "$green8" : "$gray3"} 
              color={added ? "white" : appColors.text} 
              size="$5" 
              borderRadius="$4"
              fontWeight="700"
              onPress={() => addToCart(false)}
              icon={<FontAwesome name={added ? "check" : "cart-plus"} size={18} color={added ? "white" : appColors.primary} />}
            >
              {added ? "Ajouté !" : "Panier"}
            </Button>
            <Button 
              flex={2}
              backgroundColor={appColors.primary} 
              color="white" 
              size="$5" 
              borderRadius="$4"
              fontWeight="700"
              onPress={() => addToCart(true)}
            >
              Réserver
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </View>
  );
}
