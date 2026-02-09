import React, { useState } from 'react';
import { XStack, View, Text } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import appColors from '../lib/theme';
import useAuthStore from '../lib/authStore';
import useCartStore from '../lib/cartStore';

export default function BottomNav() {
  const router = useRouter();
  const path = usePathname();
  const insets = useSafeAreaInsets();
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const { isLoggedIn, user } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const allItems = [
    { key: '/', label: 'Accueil', icon: 'home', href: '/', show: true },
    { key: '/list', label: 'Événements', icon: 'list', href: '/list', show: true },
    { key: '/scan', label: 'Scan', icon: 'camera', href: '/scan', show: user?.is_admin || user?.ROLEPERS === 'admin' },
    { key: '/login', label: 'Compte', icon: 'user', href: '/login', show: true },
    { key: '/settings', label: 'Paramètres', icon: 'cog', href: '/settings', show: true },
  ] as const;

  const navItems = allItems.filter(item => item.show);

  const bottom = (insets?.bottom ?? 0) + 22;

  return (
    <View position="absolute" left={0} right={0} bottom={bottom} alignItems="center" pointerEvents="box-none">
      <XStack
        gap={8}
        alignItems="center"
        backgroundColor={appColors.background}
        borderRadius={9999}
        paddingVertical={10}
        paddingHorizontal={12}
        elevation={8}
        style={{ shadowColor: appColors.backgroundDark, shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } }}
      >
        {navItems.map((it) => {
          const active = path === it.href;
          const highlighted = active || pressedKey === it.key;

          return (
            <TouchableOpacity
              key={it.key}
              accessibilityLabel={it.label}
              onPress={() => {
                if (path !== it.href) {
                  router.push(it.href);
                }
              }}
              onPressIn={() => setPressedKey(it.key)}
              onPressOut={() => setPressedKey(null)}
              style={{ alignItems: 'center', paddingHorizontal: 2 }}
            >
              <View
                alignItems="center"
                justifyContent="center"
                width={52}
                height={44}
                borderRadius={999}
                backgroundColor={highlighted ? appColors.primary : 'transparent'}
                position="relative"
              >
                <FontAwesome name={it.icon as any} size={22} color={highlighted ? appColors.onPrimary : appColors.text} />
                
                {it.key === '/login' && cartCount > 0 && (
                  <View 
                    position="absolute" 
                    top={0} 
                    right={0} 
                    backgroundColor="$red10" 
                    minWidth={20} 
                    height={20} 
                    borderRadius={10} 
                    borderWidth={2}
                    borderColor={highlighted ? appColors.primary : appColors.background}
                    justifyContent="center" 
                    alignItems="center"
                    paddingHorizontal={2}
                    zIndex={1}
                  >
                    <Text color="white" fontSize={10} fontWeight="900">
                      {cartCount > 9 ? '9+' : cartCount}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </XStack>
    </View>
  );
}
