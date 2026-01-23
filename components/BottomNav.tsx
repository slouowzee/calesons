import { XStack, View, Text } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomNav() {
  const router = useRouter();
  const path = usePathname();
  const insets = useSafeAreaInsets();

  const items = [
    { key: '/', label: 'Accueil', icon: 'home', href: '/' },
    { key: '/list', label: 'Liste', icon: 'list', href: '/list' },
    { key: '/login', label: 'Connexion', icon: 'user', href: '/login' },
  ] as const;

  const bottom = (insets?.bottom ?? 0) + 22;

  return (
    <View position="absolute" left={14} right={14} bottom={bottom} alignItems="center" pointerEvents="box-none">
      <XStack
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="#fff"
        borderRadius={9999}
        paddingVertical={10}
        paddingHorizontal={8}
        width={220}
        elevation={6}
        style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } }}
      >
        {items.map((it) => {
          const active = path === it.href;
          return (
            <TouchableOpacity
              key={it.key}
              accessibilityLabel={it.label}
              onPress={() => router.push(it.href)}
              style={{ alignItems: 'center', paddingHorizontal: 6 }}
            >
              <View alignItems="center" justifyContent="center" width={40} height={40} borderRadius={99} backgroundColor={active ? '#E8F4FF' : 'transparent'}>
                <FontAwesome name={it.icon as any} size={20} color={active ? '#0066FF' : '#666'} />
              </View>
            </TouchableOpacity>
          );
        })}
      </XStack>
    </View>
  );
}
