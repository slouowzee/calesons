import { useRouter } from 'expo-router';
import { View, Text, Button, Input, XStack } from 'tamagui';
import { useCallback } from 'react';
import useAuthFormStore from '../../lib/authFormStore';
import useAuthStore from '../../lib/authStore';
import authApi from '../../lib/authApi';
import appColors from '../../lib/theme';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const { email, password, showPassword, setField, toggleShowPassword, setMode } = useAuthFormStore();
  const { login } = useAuthStore();

  const onSubmit = useCallback(async () => {
    // call API
    try {
      const res = await authApi.login({ email, password });
      // assume res contains user
      login(res.user);
      router.replace('/');
    } catch (e) {
      console.warn('login failed', e);
    }
  }, [email, password]);

  return (
    <View flex={1} backgroundColor={appColors.background} justifyContent="center" alignItems="center" padding={16}>
      <View width="100%" maxWidth={420} paddingHorizontal="$4">
        <Text fontSize={24} fontWeight="700" textAlign="center">Connexion</Text>

        <View marginTop="$4">
          <Input width="100%" placeholder="Email" value={email} onChangeText={(t) => setField('email', t)} />
        </View>

        <View marginTop="$3">
          <View width="100%" position="relative">
            <Input
              width="100%"
              placeholder="Mot de passe"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(t) => setField('password', t)}
              paddingRight={44}
            />

            <TouchableOpacity
              onPress={() => toggleShowPassword()}
              accessibilityLabel={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              style={{ position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center' }}
            >
              <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={20} color={showPassword ? appColors.primary : appColors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View marginTop="$4">
          <Button width="100%" onPress={onSubmit}>Se connecter</Button>
        </View>

        <View marginTop="$3" alignItems="center">
          <Text fontSize={14} color={appColors.text}>
            Pas de compte ?{' '}
            <Text onPress={() => { setMode('register'); router.push('/register'); }} color={appColors.primary} fontWeight="700" accessibilityRole="button">
              Inscris-toi
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
