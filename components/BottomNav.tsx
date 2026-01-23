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
    { key: '/login', label: 'Connexion', icon: 'user', href: '/login' },
    { key: '/help', label: 'Aide', icon: 'cog', href: '/help' },
  ] as const;

  const bottom = (insets?.bottom ?? 0) + 22;

  return (
    <View position="absolute" left={14} right={14} bottom={bottom} alignItems="center" pointerEvents="box-none">
      <XStack
        justifyContent="center"
        gap={10}
        alignItems="center"
        backgroundColor={appColors.background}
        borderRadius={9999}
        paddingVertical={8}
        paddingHorizontal={6}
        width="100%"
        maxWidth={320}
        elevation={6}
        style={{ shadowColor: appColors.backgroundDark, shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } }}
      >
        {items.map((it) => {
          const active = path === it.href;
          const highlighted = active || pressedKey === it.key;

          return (
            <TouchableOpacity
              key={it.key}
              accessibilityLabel={it.label}
              onPress={() => router.push(it.href)}
              onPressIn={() => setPressedKey(it.key)}
              onPressOut={() => setPressedKey(null)}
              style={{ alignItems: 'center', paddingHorizontal: 4 }}
            >
              <View
                alignItems="center"
                justifyContent="center"
                width={48}
                height={40}
                borderRadius={999}
                backgroundColor={highlighted ? appColors.primary : 'transparent'}
              >
                <FontAwesome name={it.icon as any} size={20} color={highlighted ? appColors.onPrimary : appColors.text} />
              </View>
            </TouchableOpacity>
          );
        })}
      </XStack>
    </View>
  );
}
