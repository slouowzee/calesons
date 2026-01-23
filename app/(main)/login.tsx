import { useRouter } from 'expo-router';
import { View, Text, Button, Input } from 'tamagui';
import { useCallback } from 'react';
import useAuthFormStore from '../../lib/authFormStore';
import useAuthStore from '../../lib/authStore';
import authApi from '../../lib/authApi';

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
    <View flex={1} backgroundColor="white" justifyContent="center" alignItems="center" padding={16}>
      <View width="100%" maxWidth={420} paddingHorizontal="$4">
        <Text fontSize={24} fontWeight="700" textAlign="center">Connexion</Text>

        <View marginTop="$4">
          <Input width="100%" placeholder="Email" value={email} onChangeText={(t) => setField('email', t)} />
        </View>

        <View marginTop="$3">
          <Input width="100%" placeholder="Mot de passe" secureTextEntry={!showPassword} value={password} onChangeText={(t) => setField('password', t)} />
          <View marginTop="$2">
            <Button width="100%" onPress={() => toggleShowPassword()}>{showPassword ? 'Cacher' : 'Afficher'}</Button>
          </View>
        </View>

        <View marginTop="$4">
          <Button width="100%" onPress={onSubmit}>Se connecter</Button>
        </View>

        <View marginTop="$3">
          <Button width="100%" onPress={() => { setMode('register'); router.push('/register'); }}>Pas de compte ? Inscris-toi</Button>
        </View>
      </View>
    </View>
  );
}
