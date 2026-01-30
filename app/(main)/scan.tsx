import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Alert, useWindowDimensions, Platform, Vibration, Linking, PixelRatio } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { View, Text, Button, YStack } from 'tamagui';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RESULTS } from 'react-native-permissions';
import appColors from '../../lib/theme';
import { EPermissionTypes, usePermissions } from '../../hooks/usePermissions';
import { useAppStateListener } from '../../hooks/useAppStateListener';

export default function ScanScreen() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const device = useCameraDevice('back');
  const isFocused = useIsFocused();
  
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const isScanningRef = useRef(true);

  const { askPermissions } = usePermissions(EPermissionTypes.CAMERA);
  const { appState } = useAppStateListener();

  const reticleSize = 280;
  const verticalOffset = 0; 
  
  const centerY = screenHeight / 2 + verticalOffset;
  const centerX = screenWidth / 2;

  useEffect(() => {
    const checkPermissions = async () => {
      const result = await askPermissions();
      if (result.type === RESULTS.GRANTED || result.type === RESULTS.LIMITED) {
        setHasPermission(true);
      }
    };
    checkPermissions();
  }, [askPermissions]);

  useEffect(() => {
    isScanningRef.current = isScanning;
  }, [isScanning]);

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: (codes, frame) => {
      if (!isScanningRef.current || codes.length === 0) return;
      const code = codes[0];
      if (!code.value || !code.frame) return;

      const { width: fW, height: fH } = frame;
      const centerX = (code.frame.x + code.frame.width / 2) / fW;
      const centerY = (code.frame.y + code.frame.height / 2) / fH;

      const isInside = 
        centerX > 0.35 && centerX < 0.65 && 
        centerY > 0.35 && centerY < 0.65;

      if (isInside) {
        isScanningRef.current = false;
        setIsScanning(false);
        Vibration.vibrate(100);
        
        Alert.alert("Code détecté", code.value, [
          { 
            text: "OK", 
            onPress: () => {
              setIsScanning(true);
              isScanningRef.current = true;
            } 
          }
        ]);
      }
    }
  });

  if (!hasPermission || device == null) {
    return (
      <View flex={1} backgroundColor={appColors.background} justifyContent="center" alignItems="center">
        <Text color={appColors.text}>{!hasPermission ? "Demande de permission..." : "Caméra non détectée"}</Text>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="black">
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused && isScanning && appState === 'active'}
        codeScanner={codeScanner}
        enableZoomGesture
        photo={false}
      />

      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]} pointerEvents="none">
        <View
          style={{
            width: reticleSize + 3000,
            height: reticleSize + 3000,
            borderWidth: 1500,
            borderColor: 'rgba(0,0,0,0.6)',
            borderRadius: 1500 + 40,
          }}
        />
      </View>

      <View style={StyleSheet.absoluteFill} pointerEvents="none" justifyContent="center" alignItems="center">
        <View width={reticleSize} height={reticleSize} marginTop={verticalOffset * 2}>
          <View position="absolute" top={0} left={0} width={45} height={45} borderTopWidth={6} borderLeftWidth={6} borderColor={appColors.primary} borderTopLeftRadius={30} />
          <View position="absolute" top={0} right={0} width={45} height={45} borderTopWidth={6} borderRightWidth={6} borderColor={appColors.primary} borderTopRightRadius={30} />
          <View position="absolute" bottom={0} left={0} width={45} height={45} borderBottomWidth={6} borderLeftWidth={6} borderColor={appColors.primary} borderBottomLeftRadius={30} />
          <View position="absolute" bottom={0} right={0} width={45} height={45} borderBottomWidth={6} borderRightWidth={6} borderColor={appColors.primary} borderBottomRightRadius={30} />
        </View>
      </View>

      {!isScanning && (
        <YStack position="absolute" bottom={120} width="100%" alignItems="center">
          <Button backgroundColor={appColors.primary} color="white" size="$5" borderRadius={999} onPress={() => setIsScanning(true)}>
            Scanner à nouveau
          </Button>
        </YStack>
      )}
    </View>
  );
}




