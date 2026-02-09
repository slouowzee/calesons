import { useRouter } from 'expo-router';
import { View, Text, Button, Input, YStack, H4, XStack, Spinner } from 'tamagui';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAuthStore from '../../lib/authStore';
import authApi from '../../lib/authApi';
import appColors from '../../lib/theme';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, token, setAuth } = useAuthStore();
  
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const formatPhone = (val: string) => {
    let digits = String(val).replace(/\D/g, '');
    if (digits.length > 0 && digits[0] !== '0') {
      digits = '0' + digits;
    }
    return digits.match(/.{1,2}/g)?.join(' ').substring(0, 14) || digits;
  };

  useEffect(() => {
    const refreshUser = async () => {
      if (!token) return;
      setFetching(true);
      try {
        const userData = await authApi.getMe(token);
        if (userData) {
          setAuth(userData, token);
          setNom(userData.NOMPERS || '');
          setPrenom(userData.PRENOMPERS || '');
          setEmail(userData.MAILCLIENT || '');
          setTel(formatPhone(userData.TELCLIENT || userData.TELPERS || ''));
        }
      } catch (e) {
        if (user) {
          setNom(user.NOMPERS || '');
          setPrenom(user.PRENOMPERS || '');
          setEmail(user.MAILCLIENT || '');
          setTel(formatPhone(user.TELCLIENT || user.TELPERS || ''));
        }
      } finally {
        setFetching(false);
      }
    };

    refreshUser();
  }, [token]);

  const onUpdate = async () => {
    if (!token) return;

    if (showPasswordSection && (password || currentPassword)) {
      if (!currentPassword) {
        Alert.alert("Erreur", "Le mot de passe actuel est requis.");
        return;
      }
      if (password !== passwordConfirmation) {
        Alert.alert("Erreur", "Les nouveaux mots de passe ne correspondent pas.");
        return;
      }
      if (password.length < 6) {
        Alert.alert("Erreur", "Le nouveau mot de passe doit faire au moins 6 caractères.");
        return;
      }
    }

    setLoading(true);
    try {
      // 1. Mise à jour des informations du profil
      await authApi.updateProfile({
        nom,
        prenom,
        email,
        tel: tel.replace(/\D/g, ''), // Envoi du format brut
      });

      // 2. Mise à jour du mot de passe si le formulaire est ouvert et rempli
      if (showPasswordSection && password) {
        await authApi.changePassword({
          current_password: currentPassword,
          new_password: password,
          new_password_confirmation: passwordConfirmation
        });
      }
      
      // On rafraîchit le store local avec les nouvelles données
      const updatedUser = await authApi.getMe(token);
      setAuth(updatedUser, token);

      Alert.alert("Succès", "Vos informations ont été mises à jour.");
      router.back();
    } catch (e: any) {
      console.error("Update profile failed", e);
      const msg = e.response?.data?.message || "Impossible de mettre à jour le profil.";
      Alert.alert("Erreur", msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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
        <H4 fontWeight="800">Modifier mon profil</H4>
      </XStack>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 150 }}>
        <YStack gap="$4">
          <YStack gap="$2">
            <Text fontWeight="600" color="$gray10">Nom</Text>
            <Input size="$5" value={nom} onChangeText={setNom} borderWidth={2} focusStyle={{ borderColor: appColors.primary }} />
          </YStack>

          <YStack gap="$2">
            <Text fontWeight="600" color="$gray10">Prénom</Text>
            <Input size="$5" value={prenom} onChangeText={setPrenom} borderWidth={2} focusStyle={{ borderColor: appColors.primary }} />
          </YStack>

          <YStack gap="$2">
            <Text fontWeight="600" color="$gray10">Email</Text>
            <Input size="$5" value={email} onChangeText={setEmail} keyboardType="email-address" borderWidth={2} focusStyle={{ borderColor: appColors.primary }} />
          </YStack>

          <YStack gap="$2">
            <Text fontWeight="600" color="$gray10">Téléphone</Text>
            <Input 
              size="$5" 
              value={tel} 
              onChangeText={(t) => setTel(formatPhone(t))} 
              keyboardType="phone-pad" 
              borderWidth={2} 
              focusStyle={{ borderColor: appColors.primary }} 
            />
          </YStack>

          {!showPasswordSection ? (
            <Button 
              themeInverse
              icon={<FontAwesome name="lock" />}
              onPress={() => setShowPasswordSection(true)}
            >
              Changer le mot de passe
            </Button>
          ) : (
            <YStack gap="$4" padding="$3" backgroundColor="$gray1" borderRadius="$4" borderWidth={1} borderColor="$gray3">
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontWeight="700">Modification du mot de passe</Text>
                <TouchableOpacity onPress={() => setShowPasswordSection(false)}>
                  <FontAwesome name="times" size={20} color="$gray10" />
                </TouchableOpacity>
              </XStack>
              
              <YStack gap="$2">
                <Text fontWeight="600" color="$gray10">Mot de passe actuel</Text>
                <XStack alignItems="center" position="relative">
                  <Input 
                    secureTextEntry={!showPassword} 
                    size="$5" 
                    flex={1}
                    value={currentPassword} 
                    onChangeText={setCurrentPassword} 
                    borderWidth={2} 
                    paddingRight={45}
                    focusStyle={{ borderColor: appColors.primary }} 
                  />
                  <TouchableOpacity 
                    style={{ position: 'absolute', right: 15 }} 
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={18} color={appColors.primary} />
                  </TouchableOpacity>
                </XStack>
              </YStack>

              <YStack gap="$2">
                <Text fontWeight="600" color="$gray10">Nouveau mot de passe</Text>
                <XStack alignItems="center" position="relative">
                  <Input 
                    secureTextEntry={!showPassword} 
                    size="$5" 
                    flex={1}
                    value={password} 
                    onChangeText={setPassword} 
                    borderWidth={2} 
                    paddingRight={45}
                    focusStyle={{ borderColor: appColors.primary }} 
                  />
                  <TouchableOpacity 
                    style={{ position: 'absolute', right: 15 }} 
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={18} color={appColors.primary} />
                  </TouchableOpacity>
                </XStack>
              </YStack>

              <YStack gap="$2">
                <Text fontWeight="600" color="$gray10">Confirmer le mot de passe</Text>
                <XStack alignItems="center" position="relative">
                  <Input 
                    secureTextEntry={!showPassword} 
                    size="$5" 
                    flex={1}
                    value={passwordConfirmation} 
                    onChangeText={setPasswordConfirmation} 
                    borderWidth={2} 
                    paddingRight={45}
                    focusStyle={{ borderColor: appColors.primary }} 
                  />
                  <TouchableOpacity 
                    style={{ position: 'absolute', right: 15 }} 
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={18} color={appColors.primary} />
                  </TouchableOpacity>
                </XStack>
              </YStack>
            </YStack>
          )}

          <Button 
            marginTop="$4" 
            size="$5" 
            backgroundColor={appColors.primary} 
            color="white"
            fontWeight="700"
            onPress={onUpdate}
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </YStack>
      </ScrollView>
    </View>
  );
}
