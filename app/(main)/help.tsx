import { View, Text } from 'tamagui';
import appColors from '../../lib/theme';

export default function HelpScreen() {
  return (
    <View flex={1} backgroundColor={appColors.background} justifyContent="center" alignItems="center" padding={16}>
      <View width="100%" maxWidth={640} paddingHorizontal="$4">
        <Text fontSize={24} fontWeight="700" textAlign="center">Aide</Text>
        <Text marginTop="$4" fontSize={16} color={appColors.text}>
          Besoin d'aide ?
        </Text>
        <Text marginTop="$2" fontSize={14} color={appColors.text}>
          Si tu rencontres des problèmes avec l'application, contacte le support ou consulte la documentation.
        </Text>
      </View>
    </View>
  );
}
