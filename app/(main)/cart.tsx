import { View, Text, YStack, XStack, Button, ScrollView, Image, H4, Separator, Card } from 'tamagui';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useCartStore from '../../lib/cartStore';
import appColors from '../../lib/theme';
import { Alert, TouchableOpacity } from 'react-native';

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const total = getTotal();

  const handleRemoveItem = (id: string | number, name: string) => {
    Alert.alert(
      "Supprimer l'article",
      `Voulez-vous vraiment retirer "${name}" de votre panier ?`,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: () => removeItem(id) }
      ]
    );
  };

  const handleUpdateQuantity = (id: string | number, currentQuantity: number, name: string) => {
    if (currentQuantity <= 1) {
      handleRemoveItem(id, name);
    } else {
      updateQuantity(id, currentQuantity - 1);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push('/checkout');
  };

  return (
    <View flex={1} backgroundColor={appColors.background} paddingTop={insets.top}>
      <XStack p="$4" alignItems="center" justifyContent="space-between">
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={20} color={appColors.text} />
        </TouchableOpacity>
        <H4 color={appColors.text} fontWeight="800">Mon Panier</H4>
        <View width={20} />
      </XStack>

      {items.length === 0 ? (
        <YStack flex={1} justifyContent="center" alignItems="center" p="$5" gap="$4">
          <View backgroundColor="$gray3" p="$5" borderRadius={100}>
            <FontAwesome name="shopping-cart" size={50} color="$gray8" />
          </View>
          <Text fontSize={18} fontWeight="600" color="$gray10">Votre panier est vide</Text>
          <Button backgroundColor={appColors.primary} color="white" onPress={() => router.push('/list')}>
            Découvrir les événements
          </Button>
        </YStack>
      ) : (
        <>
          <ScrollView flex={1} p="$4">
            <YStack gap="$4" paddingBottom={100}>
              {items.map((item) => (
                <Card key={`${item.id}-${item.sessionId}`} elevate p="$3" backgroundColor="white" borderRadius="$4">
                  <XStack gap="$4">
                    <View width={80} height={80} backgroundColor="$gray3" borderRadius="$3" overflow="hidden">
                      {item.image ? (
                        <Image 
                          source={{ uri: `https://ap4-site-web-b6bf7x-24c7b9-192-168-117-32.traefik.me/storage/affiches/${item.image}` }} 
                          width="100%" 
                          height="100%"
                        />
                      ) : (
                        <View flex={1} alignItems="center" justifyContent="center">
                          <FontAwesome name="image" size={24} color="$gray8" />
                        </View>
                      )}
                    </View>
                    
                    <YStack flex={1} justifyContent="space-between">
                      <YStack gap="$1">
                        <XStack justifyContent="space-between" alignItems="flex-start">
                          <Text fontWeight="800" fontSize={16} flex={1} numberOfLines={1}>{item.name}</Text>
                          <TouchableOpacity onPress={() => handleRemoveItem(item.id, item.name)}>
                            <FontAwesome name="trash" size={18} color="$red10" />
                          </TouchableOpacity>
                        </XStack>
                        <Text fontSize={12} color="$gray10">{item.type}</Text>
                        {item.sessionDate && (
                          <Text fontSize={12} color="$gray10">
                            {new Date(item.sessionDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} à {item.sessionTime?.substring(0, 5)}
                          </Text>
                        )}
                      </YStack>

                      <XStack justifyContent="space-between" alignItems="center">
                        <Text fontWeight="700" color={appColors.primary} fontSize={16}>{item.price} €</Text>
                        <XStack alignItems="center" gap="$3" backgroundColor="$gray2" px="$3" py="$1" borderRadius="$5">
                          <TouchableOpacity onPress={() => handleUpdateQuantity(item.id, item.quantity, item.name)}>
                            <FontAwesome name="minus" size={12} color={appColors.text} />
                          </TouchableOpacity>
                          <Text fontWeight="700">{item.quantity}</Text>
                          <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                            <FontAwesome name="plus" size={12} color={appColors.text} />
                          </TouchableOpacity>
                        </XStack>
                      </XStack>
                    </YStack>
                  </XStack>
                </Card>
              ))}
            </YStack>
          </ScrollView>

          <YStack backgroundColor="white" p="$5" borderTopWidth={1} borderTopColor="$gray3" gap="$4" paddingBottom={insets.bottom + 100}>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={16} color="$gray10">Sous-total</Text>
              <Text fontSize={16} color="$gray10">{total} €</Text>
            </XStack>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={20} fontWeight="800">Total</Text>
              <Text fontSize={20} fontWeight="800" color={appColors.primary}>{total} €</Text>
            </XStack>
            <Button 
              backgroundColor={items.length === 0 ? "$gray8" : appColors.primary} 
              color="white" 
              size="$5" 
              borderRadius="$4" 
              fontWeight="800"
              onPress={handleCheckout}
              disabled={items.length === 0}
              opacity={items.length === 0 ? 0.6 : 1}
            >
              {total === 0 ? "Valider ma commande" : "Procéder au paiement"}
            </Button>
          </YStack>
        </>
      )}
    </View>
  );
}
