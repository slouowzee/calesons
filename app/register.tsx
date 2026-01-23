import { useRouter } from 'expo-router';
import { View, Text, Button, Input } from 'tamagui';
import useAuthFormStore from '../lib/authFormStore';
import authApi from '../lib/authApi';
import useAuthStore from '../lib/authStore';
import appColors from '../lib/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { name, email, password, setField, setMode, showPassword, toggleShowPassword } = useAuthFormStore();
  const { login } = useAuthStore();

  const onSubmit = async () => {
    try {
      const res = await authApi.register({ name, email, password });
      login(res.user);
      router.replace('/');
    } catch (e) {
      console.warn('register failed', e);
    }
  };

  return (
    <View flex={1} backgroundColor={appColors.background} justifyContent="center" alignItems="center" padding={16}>
      <View width="100%" maxWidth={420} paddingHorizontal="$4">
        <Text fontSize={24} fontWeight="700" textAlign="center">Inscription</Text>

        <View marginTop="$4">
          <Input width="100%" placeholder="Nom" value={name} onChangeText={(t) => setField('name', t)} />
        </View>

        <View marginTop="$3">
          <Input width="100%" placeholder="Email" value={email} onChangeText={(t) => setField('email', t)} />
        </View>

        <View marginTop="$3">
          <Input width="100%" placeholder="Mot de passe" secureTextEntry={!showPassword} value={password} onChangeText={(t) => setField('password', t)} />
          <View marginTop="$2">
            <Button width="100%" onPress={() => toggleShowPassword()}>{showPassword ? 'Cacher' : 'Afficher'}</Button>
          </View>
        </View>

        <View marginTop="$4">
          <Button width="100%" onPress={onSubmit}>Créer le compte</Button>
        </View>

        <View marginTop="$3">
          <Button width="100%" onPress={() => { setMode('login'); router.push('/login'); }}>Déjà un compte ? Connecte-toi</Button>
        </View>
      </View>
    </View>
  );
}
