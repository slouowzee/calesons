import { useRouter } from 'expo-router';
import { View, Text, Button, Input, XStack, YStack, H4, Card, Paragraph, Spinner } from 'tamagui';
import { useCallback, useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAuthFormStore from '../../lib/authFormStore';
import useAuthStore from '../../lib/authStore';
import authApi from '../../lib/authApi';
import ticketApi from '../../lib/ticketApi';
import avisApi from '../../lib/avisApi';
import appColors from '../../lib/theme';
import { TouchableOpacity, Alert, ScrollView, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import useCartStore from '../../lib/cartStore';
import QRCode from 'react-native-qrcode-svg';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [selectedQR, setSelectedQR] = useState<{ qrcodes: string[], title: string, count: number } | null>(null);
  const [currentQRIndex, setCurrentQRIndex] = useState(0);

  const { 
    mode, 
    nom, 
    prenom, 
    email, 
    tel, 
    password, 
    password_confirmation, 
    showPassword, 
    setField, 
    toggleShowPassword, 
    setMode 
  } = useAuthFormStore();
  
  const { setAuth, isLoggedIn, user, token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userAvis, setUserAvis] = useState<any[]>([]);
  const isRegister = mode === 'register';
  const isAdmin = !!(user?.is_admin || (user as any)?.ROLEPERS === 'admin');

  // Charger les billets et avis au montage si connecté (client uniquement)
  useEffect(() => {
    if (isLoggedIn && !isAdmin && (user?.id || (user as any)?.IDPERS)) {
      refreshTickets();
      refreshAvis();
    }
  }, [isLoggedIn, isAdmin, user?.id, (user as any)?.IDPERS]);

  const refreshTickets = async () => {
    const clientId = (user as any)?.IDPERS || user?.id;
    if (!clientId) return;
    setRefreshing(true);
    try {
      // Récupérer les billets du client
      const ticketRes = await ticketApi.getTicketsByClient(clientId);
      const billets = Array.isArray(ticketRes) ? ticketRes : (ticketRes.data || []);
      
      // Récupérer aussi les réservations pour avoir les infos complètes
      const resaRes = await ticketApi.getReservationsByClient(clientId);
      const reservations = Array.isArray(resaRes) ? resaRes : (resaRes.data || []);
      
      setAuth({ ...user, billets, reservations }, token || '');
    } catch (e) {
      console.error("Erreur lors de la récupération des billets:", e);
    } finally {
      setRefreshing(false);
    }
  };

  const refreshAvis = async () => {
    const clientId = (user as any)?.IDPERS || user?.id;
    if (!clientId) return;
    try {
      const res = await avisApi.getByClient(clientId);
      const avis = Array.isArray(res) ? res : (res.data || []);
      setUserAvis(avis);
    } catch (e) {
      console.error("Erreur lors de la récupération des avis:", e);
    }
  };

  const formatPhone = (val: any) => {
    if (!val) return '';
    let digits = String(val).replace(/\D/g, '');
    if (digits.length > 0 && digits[0] !== '0') {
      digits = '0' + digits;
    }
    return digits.match(/.{1,2}/g)?.join(' ').substring(0, 14) || digits;
  };

  const onSubmit = useCallback(async () => {
    if (!email || !password || (isRegister && (!nom || !prenom || !tel || !password_confirmation))) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    if (isRegister && password !== password_confirmation) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        const res = await authApi.register({ 
          nom,
          prenom,
          email, 
          tel,
          password, 
          password_confirmation
        });
        setAuth(res.user, res.token);
      } else {
        const res = await authApi.login({ email, password });
        setAuth(res.user, res.token);
      }
      router.replace('/');
    } catch (e: any) {
      console.warn(isRegister ? 'register failed' : 'login failed', e);
      const msg = e.response?.data?.message || "Une erreur est survenue lors de l'authentification.";
      Alert.alert("Échec", msg);
    } finally {
      setLoading(false);
    }
  }, [mode, nom, prenom, email, tel, password, password_confirmation, setAuth, router, isRegister]);

  if (isLoggedIn && user) {
    return (
      <View flex={1} backgroundColor={appColors.background} paddingTop={insets.top}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
          <YStack padding="$4" gap="$4">
            <H4 fontWeight="800" marginTop="$2">Mon Espace</H4>
            
            <Card elevate p="$4" backgroundColor="white" borderRadius="$4">
            <XStack gap="$4" alignItems="center">
              <View width={50} height={50} borderRadius={25} backgroundColor={appColors.primary} alignItems="center" justifyContent="center">
                <Text color="white" fontWeight="700">{user.PRENOMPERS?.[0]}{user.NOMPERS?.[0]}</Text>
              </View>
              <YStack>
                <Text fontWeight="700" fontSize={18}>{user.PRENOMPERS} {user.NOMPERS}</Text>
                <Text color="$gray10">{user.MAILCLIENT}</Text>
                { (user.TELCLIENT || user.TELPERS) && (
                  <Text color="$gray10" fontSize={12}>{formatPhone(user.TELCLIENT || user.TELPERS)}</Text>
                )}
              </YStack>
            </XStack>
          </Card>

          {!isAdmin && (
          <TouchableOpacity onPress={() => router.push('/cart')}>
            <Card elevate p="$4" backgroundColor="white" borderRadius="$4" borderWidth={1} borderColor={cartCount > 0 ? appColors.primary : "$gray3"}>
              <XStack justifyContent="space-between" alignItems="center">
                <XStack alignItems="center" gap="$3">
                  <View backgroundColor={cartCount > 0 ? "$blue1" : "$gray2"} p="$2" borderRadius="$3">
                    <FontAwesome name="shopping-basket" size={20} color={cartCount > 0 ? appColors.primary : "$gray10"} />
                  </View>
                  <YStack>
                    <Text fontWeight="700" fontSize={16}>Mon Panier</Text>
                    <Text fontSize={12} color="$gray10">
                      {cartCount > 0 ? `${cartCount} article(s) en attente` : 'Votre panier est vide'}
                    </Text>
                  </YStack>
                </XStack>
                <FontAwesome name="chevron-right" size={16} color="$gray8" />
              </XStack>
            </Card>
          </TouchableOpacity>
          )}

          {/* ─── ADMIN: Bouton modération ─────────────────────────── */}
          {isAdmin && (
            <TouchableOpacity onPress={() => router.push('/moderation')}>
              <Card elevate p="$4" backgroundColor="white" borderRadius="$4" borderWidth={1} borderColor={appColors.primary}>
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack alignItems="center" gap="$3">
                    <View backgroundColor="$orange1" p="$2" borderRadius="$3">
                      <FontAwesome name="star" size={20} color="#f59e0b" />
                    </View>
                    <YStack>
                      <Text fontWeight="700" fontSize={16}>Modération des avis</Text>
                      <Text fontSize={12} color="$gray10">Gérer les avis des utilisateurs</Text>
                    </YStack>
                  </XStack>
                  <FontAwesome name="chevron-right" size={16} color="$gray8" />
                </XStack>
              </Card>
            </TouchableOpacity>
          )}

          {/* ─── CLIENT: Mes Billets ────────────────────────────────── */}
          {!isAdmin && (
          <>
          <Text fontSize={16} fontWeight="700" marginTop="$2">Mes Billets</Text>
          {refreshing ? (
            <YStack alignItems="center" py="$4">
              <Spinner color={appColors.primary} />
            </YStack>
          ) : user.billets && user.billets.length > 0 ? (
            <YStack gap="$3">
              {/* Groupement des billets par manifestation */}
              {Object.values(user.billets.reduce((acc: any, billet: any) => {
                const key = `${billet.IDMANIF}`;
                if (!acc[key]) {
                  acc[key] = { 
                    name: billet.manifestation?.NOMMANIF || billet.NOMFESTIVAL || 'Événement', 
                    type: billet.manifestation?.concert ? 'Concert' : billet.manifestation?.conference ? 'Conférence' : 'Événement',
                    date: billet.reservation?.DATEHEURERESERVATION || billet.manifestation?.sessions?.[0]?.DATESESSION,
                    count: 0,
                    ids: [],
                    qrcodes: [],
                    usedCount: 0
                  };
                }
                acc[key].count += 1;
                acc[key].ids.push(billet.IDBILLET || billet.ID_BILLET);
                if (billet.QRCODEBILLET || billet.QRCODE) {
                  acc[key].qrcodes.push(billet.QRCODEBILLET || billet.QRCODE);
                }
                if (billet.INVITEBILLET) {
                  acc[key].usedCount += 1;
                }
                return acc;
              }, {})).map((group: any, idx: number) => (
                <Card key={idx} elevate p="$4" backgroundColor="white" borderRadius="$4" borderWidth={1} borderColor="$gray3">
                  <YStack gap="$2">
                    <XStack justifyContent="space-between" alignItems="flex-start">
                      <YStack gap="$1" flex={1}>
                        <Text fontWeight="800" fontSize={16}>{group.name}</Text>
                        <Text fontSize={12} color="$gray10">{group.type} • {group.count} place(s)</Text>
                      </YStack>
                      <View backgroundColor={group.usedCount === group.count ? "$green2" : "$blue1"} px="$2" py="$1" borderRadius="$2">
                        <Text fontSize={11} fontWeight="700" color={group.usedCount === group.count ? "$green10" : appColors.primary}>
                          {group.usedCount === group.count ? 'UTILISÉ' : 'VALIDE'}
                        </Text>
                      </View>
                    </XStack>
                    
                    <XStack alignItems="center" gap="$2" marginTop="$1">
                      <FontAwesome name="calendar" size={12} color="$gray10" />
                      <Text fontSize={12} color="$gray10">
                        {group.date ? new Date(group.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : 'Date à venir'}
                      </Text>
                    </XStack>

                    {group.qrcodes.length > 0 && (
                      <Button 
                        marginTop="$2"
                        backgroundColor={appColors.primary} 
                        color="white" 
                        size="$3"
                        icon={<FontAwesome name="qrcode" color="white" />}
                        onPress={() => {
                          setCurrentQRIndex(0);
                          setSelectedQR({
                            qrcodes: group.qrcodes,
                            title: group.name,
                            count: group.count
                          });
                        }}
                      >
                        Voir {group.count > 1 ? `les ${group.count} QR Codes` : 'le QR Code'}
                      </Button>
                    )}
                  </YStack>
                </Card>
              ))}
            </YStack>
          ) : (
            <Card elevate p="$4" backgroundColor="white" borderRadius="$4" borderStyle="dashed" borderWidth={1} borderColor="$gray8">
              <YStack alignItems="center" py="$4" gap="$2">
                <FontAwesome name="ticket" size={32} color="$gray8" />
                <Paragraph color="$gray10">Vous n'avez pas encore de billets.</Paragraph>
                <Button size="$3" backgroundColor={appColors.primary} color="white" onPress={() => router.push('/list')}>
                  Parcourir les événements
                </Button>
              </YStack>
            </Card>
          )}

          <Text fontSize={16} fontWeight="700" marginTop="$2">Mes Avis</Text>
          {userAvis.length > 0 ? (
            <YStack gap="$3">
              {userAvis.map((avis: any) => {
                const manifName = avis.manifestation?.NOMMANIF || 'Événement';
                const isApproved = avis.APPROUVERAVIS;
                return (
                  <Card key={avis.IDAVIS} p="$3" backgroundColor="white" borderRadius="$3" borderWidth={1} borderColor={isApproved ? "$green4" : "$orange3"}>
                    <YStack gap="$2">
                      <XStack justifyContent="space-between" alignItems="center">
                        <Text fontWeight="700" fontSize={14} flex={1} numberOfLines={1}>{manifName}</Text>
                        <XStack gap="$2" alignItems="center">
                          <XStack gap="$1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <FontAwesome key={s} name={s <= avis.NOTEAVIS ? "star" : "star-o"} size={13} color="#f59e0b" />
                            ))}
                          </XStack>
                          <TouchableOpacity onPress={() => {
                            Alert.alert("Supprimer l'avis", "Voulez-vous vraiment supprimer cet avis ?", [
                              { text: "Annuler", style: "cancel" },
                              { text: "Supprimer", style: "destructive", onPress: async () => {
                                try {
                                  await avisApi.delete(avis.IDAVIS);
                                  setUserAvis(prev => prev.filter(a => a.IDAVIS !== avis.IDAVIS));
                                } catch (e: any) {
                                  Alert.alert("Erreur", e.response?.data?.message || "Impossible de supprimer l'avis.");
                                }
                              }},
                            ]);
                          }}>
                            <FontAwesome name="trash" size={14} color="#dc2626" />
                          </TouchableOpacity>
                        </XStack>
                      </XStack>
                      {avis.COMMENTAIREAVIS && (
                        <Text fontSize={12} color="$gray11" numberOfLines={2}>"{avis.COMMENTAIREAVIS}"</Text>
                      )}
                      <View backgroundColor={isApproved ? "$green2" : "$orange2"} px="$2" py="$0.5" borderRadius="$2" alignSelf="flex-start">
                        <Text fontSize={10} fontWeight="700" color={isApproved ? "$green10" : "$orange10"}>
                          {isApproved ? 'Publié' : 'En attente de modération'}
                        </Text>
                      </View>
                    </YStack>
                  </Card>
                );
              })}
            </YStack>
          ) : (
            <Text fontSize={13} color="$gray10">Vous n'avez pas encore donné d'avis.</Text>
          )}
          </>
          )}

          <Text fontSize={16} fontWeight="700" marginTop="$2">Actions</Text>
          <YStack gap="$2">
            <Button 
              themeInverse 
              icon={<FontAwesome name="edit" />} 
              justifyContent="flex-start"
              onPress={() => router.push('/edit-profile')}
            >
              Modifier mes infos
            </Button>
            {!isAdmin && (
            <Button 
              themeInverse 
              icon={<FontAwesome name="history" />} 
              justifyContent="flex-start"
              onPress={() => router.push('/history')}
            >
              Historique des achats
            </Button>
            )}
          </YStack>
        </YStack>
      </ScrollView>

      {/* Modal pour afficher le QR Code */}
      <Modal
        visible={!!selectedQR}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedQR(null)}
      >
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={1}
          onPress={() => setSelectedQR(null)}
        >
          <Card elevate p="$6" backgroundColor="white" borderRadius="$6" alignItems="center" gap="$5" width="85%">
            <YStack alignItems="center" gap="$2">
              <H4 textAlign="center" fontWeight="800">{selectedQR?.title}</H4>
              <Text color="$gray10" fontSize={14}>
                {selectedQR && selectedQR.count > 1
                  ? `Billet ${currentQRIndex + 1} sur ${selectedQR.count}`
                  : 'Présentez ce code à l\'entrée'}
              </Text>
            </YStack>

            <View p="$4" backgroundColor="white" borderRadius="$4" borderWidth={1} borderColor="$gray3">
              {selectedQR && selectedQR.qrcodes[currentQRIndex] && (
                <QRCode
                  value={selectedQR.qrcodes[currentQRIndex]}
                  size={220}
                  color="black"
                  backgroundColor="white"
                />
              )}
            </View>

            {selectedQR && selectedQR.count > 1 && (
              <XStack gap="$3" alignItems="center">
                <Button
                  size="$3"
                  circular
                  disabled={currentQRIndex === 0}
                  opacity={currentQRIndex === 0 ? 0.3 : 1}
                  backgroundColor={appColors.primary}
                  onPress={() => setCurrentQRIndex(i => i - 1)}
                >
                  <FontAwesome name="chevron-left" size={14} color="white" />
                </Button>
                <Text fontWeight="700" fontSize={16} color={appColors.primary}>
                  {currentQRIndex + 1} / {selectedQR.count}
                </Text>
                <Button
                  size="$3"
                  circular
                  disabled={currentQRIndex === selectedQR.qrcodes.length - 1}
                  opacity={currentQRIndex === selectedQR.qrcodes.length - 1 ? 0.3 : 1}
                  backgroundColor={appColors.primary}
                  onPress={() => setCurrentQRIndex(i => i + 1)}
                >
                  <FontAwesome name="chevron-right" size={14} color="white" />
                </Button>
              </XStack>
            )}

            <YStack alignItems="center" gap="$1">
              <Text fontWeight="700" color={appColors.primary}>BILLET INDIVIDUEL</Text>
              <Text fontSize={11} color="$gray9" textAlign="center">
                Chaque billet possède un QR code unique à présenter à l'entrée.
              </Text>
            </YStack>

            <Button width="100%" backgroundColor="$gray3" onPress={() => setSelectedQR(null)}>
              Fermer
            </Button>
          </Card>
        </TouchableOpacity>
      </Modal>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor={appColors.background} justifyContent="center" alignItems="center" padding={16} paddingTop={insets.top}>
      <YStack width="100%" maxWidth={420} paddingHorizontal="$4" gap="$4">
        <Text fontSize={28} fontWeight="800" textAlign="center" color={appColors.primary}>
          {isRegister ? 'Créer un compte' : 'Bon retour !'}
        </Text>
        
        <Text fontSize={16} textAlign="center" color={appColors.text} opacity={0.7} marginBottom="$2">
          {isRegister ? 'Inscrivez-vous pour commencer' : 'Connectez-vous à votre compte'}
        </Text>

        {isRegister && (
          <XStack gap="$2" width="100%">
            <Input 
              flex={1}
              size="$5"
              placeholder="Nom" 
              value={nom} 
              onChangeText={(t) => setField('nom', t)} 
              borderWidth={2}
              focusStyle={{ borderColor: appColors.primary }}
            />
            <Input 
              flex={1}
              size="$5"
              placeholder="Prénom" 
              value={prenom} 
              onChangeText={(t) => setField('prenom', t)} 
              borderWidth={2}
              focusStyle={{ borderColor: appColors.primary }}
            />
          </XStack>
        )}

        {isRegister && (
          <Input 
            size="$5"
            width="100%" 
            placeholder="Téléphone (ex: 0601020304)" 
            keyboardType="phone-pad"
            value={tel} 
            onChangeText={(t) => setField('tel', t)} 
            borderWidth={2}
            focusStyle={{ borderColor: appColors.primary }}
          />
        )}

        <Input 
          size="$5"
          width="100%" 
          placeholder="Email" 
          keyboardType="email-address"
          autoCapitalize="none"
          value={email} 
          onChangeText={(t) => setField('email', t)} 
          borderWidth={2}
          focusStyle={{ borderColor: appColors.primary }}
        />

        <View position="relative">
          <Input
            size="$5"
            width="100%"
            placeholder="Mot de passe"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(t) => setField('password', t)}
            paddingRight={50}
            borderWidth={2}
            focusStyle={{ borderColor: appColors.primary }}
          />
          <TouchableOpacity
            onPress={() => toggleShowPassword()}
            style={{ position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center' }}
          >
            <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={20} color={appColors.primary} />
          </TouchableOpacity>
        </View>

        {isRegister && (
          <Input
            size="$5"
            width="100%"
            placeholder="Confirmer le mot de passe"
            secureTextEntry={!showPassword}
            value={password_confirmation}
            onChangeText={(t) => setField('password_confirmation', t)}
            borderWidth={2}
            focusStyle={{ borderColor: appColors.primary }}
          />
        )}

        <Button 
          size="$5" 
          width="100%" 
          onPress={onSubmit} 
          backgroundColor={appColors.primary} 
          color="white"
          fontWeight="700"
          disabled={loading}
          opacity={loading ? 0.7 : 1}
        >
          {loading ? 'Traitement...' : (isRegister ? 'S\'inscrire' : 'Se connecter')}
        </Button>

        <XStack justifyContent="center" gap="$2" marginTop="$2">
          <Text fontSize={14} color={appColors.text}>
            {isRegister ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
          </Text>
          <TouchableOpacity onPress={() => setMode(isRegister ? 'login' : 'register')}>
            <Text color={appColors.primary} fontWeight="700">
              {isRegister ? 'Connectez-vous' : 'Inscrivez-vous'}
            </Text>
          </TouchableOpacity>
        </XStack>
      </YStack>
    </View>
  );
}
