import { View, Text, YStack, XStack, Button, H4, Card, Separator, Switch, Label } from 'tamagui';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import appColors from '../../lib/theme';
import useAuthStore from '../../lib/authStore';
import { ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isLoggedIn, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Suppression du compte",
      "Cette action est irréversible. Toutes vos données (billets, historique) seront supprimées définitivement.",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer définitivement", 
          style: "destructive",
          onPress: async () => {
            try {
              await authApi.deleteAccount();
              logout();
              router.replace('/login');
              Alert.alert("Compte supprimé", "Votre compte a été supprimé avec succès.");
            } catch (e: any) {
              Alert.alert("Erreur", "Impossible de supprimer le compte pour le moment.");
            }
          } 
        }
      ]
    );
  };

  const SettingItem = ({ icon, label, onPress, color = appColors.text, rightElement = null }: any) => (
    <TouchableOpacity onPress={onPress}>
      <XStack p="$4" alignItems="center" justifyContent="space-between" backgroundColor="white">
        <XStack gap="$4" alignItems="center">
          <View width={36} height={36} borderRadius={18} backgroundColor="$gray2" alignItems="center" justifyContent="center">
            <FontAwesome name={icon} size={18} color={appColors.primary} />
          </View>
          <Text fontWeight="600" fontSize={16} color={color}>{label}</Text>
        </XStack>
        {rightElement || <FontAwesome name="chevron-right" size={14} color="$gray8" />}
      </XStack>
    </TouchableOpacity>
  );

  return (
    <View flex={1} backgroundColor={appColors.background} paddingTop={insets.top}>
      <XStack p="$4" alignItems="center" justifyContent="flex-start">
        <H4 fontWeight="800">Paramètres</H4>
      </XStack>

      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <YStack gap="$4" p="$4">
          
          <YStack borderRadius="$4" overflow="hidden" backgroundColor="white" borderWidth={1} borderColor="$gray3">
            <Text px="$4" py="$3" fontSize={12} fontWeight="800" color="$gray10" backgroundColor="$gray1">GÉNÉRAL</Text>
            <Separator />
            <SettingItem icon="bell" label="Notifications" onPress={() => {}} />
            <Separator />
            <SettingItem 
              icon="question-circle" 
              label="Aide & Support" 
              onPress={() => Linking.openURL('https://calesons-festival.fr/support')} 
            />
          </YStack>

          <YStack borderRadius="$4" overflow="hidden" backgroundColor="white" borderWidth={1} borderColor="$gray3">
            <Text px="$4" py="$3" fontSize={12} fontWeight="800" color="$gray10" backgroundColor="$gray1">LÉGAL & CONFIDENTIALITÉ</Text>
            <Separator />
            <SettingItem icon="file-text-o" label="CGU" onPress={() => router.push('/cgu')} />
            <Separator />
            <SettingItem icon="shopping-cart" label="CGV" onPress={() => router.push('/cgv')} />
            <Separator />
            <SettingItem icon="shield" label="Politique de confidentialité" onPress={() => router.push('/privacy')} />
          </YStack>

          <YStack borderRadius="$4" overflow="hidden" backgroundColor="white" borderWidth={1} borderColor="$gray3">
            <Text px="$4" py="$3" fontSize={12} fontWeight="800" color="$gray10" backgroundColor="$gray1">AUTRE</Text>
            <Separator />
            <SettingItem icon="info-circle" label="À propos" onPress={() => router.push('/about')} />
          </YStack>

          {isLoggedIn && (
            <YStack borderRadius="$4" overflow="hidden" backgroundColor="white" borderWidth={1} borderColor="$gray3">
              <Text px="$4" py="$3" fontSize={12} fontWeight="800" color="$gray10" backgroundColor="$gray1">COMPTE & SÉCURITÉ</Text>
              <Separator />
              <SettingItem 
                icon="sign-out" 
                label="Déconnexion" 
                onPress={handleLogout} 
              />
              
              {(user?.is_admin === 0 || (!user?.is_admin && user?.ROLEPERS !== 'admin')) && (
                <>
                  <Separator />
                  <TouchableOpacity onPress={handleDeleteAccount}>
                    <XStack p="$4" alignItems="center" justifyContent="space-between" backgroundColor="$red1">
                      <XStack gap="$4" alignItems="center">
                        <View width={36} height={36} borderRadius={18} backgroundColor="$red2" alignItems="center" justifyContent="center">
                          <FontAwesome name="trash" size={18} color="$red10" />
                        </View>
                        <Text fontWeight="600" fontSize={16} color="$red10">Supprimer mon compte</Text>
                      </XStack>
                    </XStack>
                  </TouchableOpacity>
                </>
              )}
            </YStack>
          )}

          <YStack alignItems="center" marginTop="$6" gap="$4">
            <XStack gap="$5">
              <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/LesCaleSons/?locale=fr_FR')}>
                <FontAwesome name="facebook-square" size={32} color="#1877F2" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/les_cale_sons/')}>
                <FontAwesome name="instagram" size={32} color="#E4405F" />
              </TouchableOpacity>
            </XStack>
            
            <YStack alignItems="center" gap="$1">
              <Text fontSize={12} color="$gray8">Version 1.0.0</Text>
              <Text fontSize={12} color="$gray8">© 2026 Calesons</Text>
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </View>
  );
}
