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
  const { mode, name, email, password, showPassword, setField, toggleShowPassword, setMode } = useAuthFormStore();
  const { login } = useAuthStore();
  const isRegister = mode === 'register';

  const onSubmit = useCallback(async () => {
    try {
      if (isRegister) {
        const res = await authApi.register({ name: name || '', email, password });
        login(res.user);
      } else {
        const res = await authApi.login({ email, password });
        login(res.user);
      }
      router.replace('/');
    } catch (e) {
      console.warn(isRegister ? 'register failed' : 'login failed', e);
    }
  }, [mode, name, email, password]);

  return (
    <View flex={1} backgroundColor={appColors.background} justifyContent="center" alignItems="center" padding={16}>
      <View width="100%" maxWidth={420} paddingHorizontal="$4">
        <Text fontSize={24} fontWeight="700" textAlign="center">
          {isRegister ? 'Inscription' : 'Connexion'}
        </Text>

        {isRegister && (
          <View marginTop="$4">
            <Input width="100%" placeholder="Nom" value={name} onChangeText={(t) => setField('name', t)} />
          </View>
        )}

        <View marginTop={isRegister ? "$3" : "$4"}>
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
          <Button width="100%" onPress={onSubmit}>
            {isRegister ? 'Créer mon compte' : 'Se connecter'}
          </Button>
        </View>

        <View marginTop="$3" alignItems="center">
          <Text fontSize={14} color={appColors.text}>
            {isRegister ? 'Déjà un compte ? ' : 'Pas de compte ? '}
            <Text
              onPress={() => setMode(isRegister ? 'login' : 'register')}
              color={appColors.primary}
              fontWeight="700"
              accessibilityRole="button"
            >
              {isRegister ? 'Connecte-toi' : 'Inscris-toi'}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
