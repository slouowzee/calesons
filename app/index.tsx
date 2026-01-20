import { View, Text, Button } from 'tamagui';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View flex={1} alignItems="center" justifyContent="center" backgroundColor="white">
      <Text fontSize={24} fontWeight="700" color="$black">Bonjour</Text>
      <Text mt="$2" color="$black">Bienvenue sur l'application.</Text>
    </View>
  );
}
