import React, { useState } from 'react';
import { XStack, View } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import appColors from '../lib/theme';

export default function BottomNav() {
  const router = useRouter();
  const path = usePathname();
  const insets = useSafeAreaInsets();
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const items = [
    { key: '/', label: 'Accueil', icon: 'home', href: '/' },
    { key: '/list', label: 'Liste', icon: 'list', href: '/list' },
    { key: '/scan', label: 'Scan', icon: 'camera', href: '/scan' },
    { key: '/login', label: 'Connexion', icon: 'user', href: '/login' },
    { key: '/settings', label: 'Paramètres', icon: 'cog', href: '/settings' },
  ] as const;

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
        {items.map((it) => {
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
              >
                <FontAwesome name={it.icon as any} size={22} color={highlighted ? appColors.onPrimary : appColors.text} />
              </View>
            </TouchableOpacity>
          );
        })}
      </XStack>
    </View>
  );
}
