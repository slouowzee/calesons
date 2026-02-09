import React, { useState, useCallback } from 'react';
import { View, Text, YStack, XStack, H4, Card, Spinner, Button, Paragraph } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import appColors from '../../lib/theme';
import avisApi from '../../lib/avisApi';

export default function ModerationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const { data: allAvis = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-avis'],
    queryFn: async () => {
      const res = await avisApi.getAll();
      return res.data || [];
    },
  });

  const filteredAvis = allAvis.filter((avis: any) => {
    if (filter === 'pending') return !avis.APPROUVERAVIS;
    if (filter === 'approved') return avis.APPROUVERAVIS;
    return true;
  });

  const pendingCount = allAvis.filter((a: any) => !a.APPROUVERAVIS).length;
  const approvedCount = allAvis.filter((a: any) => a.APPROUVERAVIS).length;

  const handleApprove = useCallback(async (avisId: number) => {
    setActionLoading(avisId);
    try {
      await avisApi.approve(avisId);
      queryClient.invalidateQueries({ queryKey: ['admin-avis'] });
    } catch (e: any) {
      Alert.alert("Erreur", e.response?.data?.message || "Impossible d'approuver cet avis.");
    } finally {
      setActionLoading(null);
    }
  }, [queryClient]);

  const handleReject = useCallback(async (avisId: number) => {
    setActionLoading(avisId);
    try {
      await avisApi.reject(avisId);
      queryClient.invalidateQueries({ queryKey: ['admin-avis'] });
    } catch (e: any) {
      Alert.alert("Erreur", e.response?.data?.message || "Impossible de rejeter cet avis.");
    } finally {
      setActionLoading(null);
    }
  }, [queryClient]);

  const handleDelete = useCallback(async (avisId: number) => {
    Alert.alert(
      "Supprimer l'avis",
      "Cette action est irréversible. Voulez-vous continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            setActionLoading(avisId);
            try {
              await avisApi.delete(avisId);
              queryClient.invalidateQueries({ queryKey: ['admin-avis'] });
            } catch (e: any) {
              Alert.alert("Erreur", e.response?.data?.message || "Impossible de supprimer cet avis.");
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  }, [queryClient]);

  const renderStars = (note: number) => (
    <XStack gap="$1">
      {[1, 2, 3, 4, 5].map(s => (
        <FontAwesome key={s} name={s <= note ? "star" : "star-o"} size={14} color="#f59e0b" />
      ))}
    </XStack>
  );

  if (isLoading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" backgroundColor={appColors.background}>
        <Spinner size="large" color={appColors.primary} />
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor={appColors.background} paddingTop={insets.top}>
      {/* Header with back button */}
      <XStack p="$4" pb="$2" alignItems="center" gap="$3">
        <TouchableOpacity onPress={() => router.back()}>
          <View width={36} height={36} borderRadius={18} backgroundColor="$gray3" justifyContent="center" alignItems="center">
            <FontAwesome name="chevron-left" size={14} color={appColors.text} />
          </View>
        </TouchableOpacity>
        <YStack flex={1} gap="$1">
          <H4 fontWeight="800">Modération des avis</H4>
          <Text fontSize={12} color="$gray10">
            {pendingCount} en attente • {approvedCount} approuvé(s) • {allAvis.length} au total
          </Text>
        </YStack>
      </XStack>

      {/* Filtres */}
      <XStack px="$4" gap="$2" marginBottom="$2">
        {([
          { key: 'pending', label: 'En attente', icon: 'clock-o' },
          { key: 'approved', label: 'Approuvés', icon: 'check' },
          { key: 'all', label: 'Tous', icon: 'list' },
        ] as const).map(f => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={{ flex: 1 }}
          >
            <View
              backgroundColor={filter === f.key ? appColors.primary : 'white'}
              py="$2"
              borderRadius="$3"
              alignItems="center"
              borderWidth={1}
              borderColor={filter === f.key ? appColors.primary : "$gray4"}
            >
              <FontAwesome name={f.icon as any} size={12} color={filter === f.key ? 'white' : '#999'} />
              <Text fontSize={10} fontWeight="600" color={filter === f.key ? 'white' : '$gray10'} marginTop="$1">
                {f.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </XStack>

      <FlatList
        data={filteredAvis}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        keyExtractor={(item: any) => String(item.IDAVIS)}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => refetch()} tintColor={appColors.primary} />
        }
        renderItem={({ item }) => {
          const clientName = item.billet?.client
            ? `${item.billet.client.PRENOMPERS || ''} ${item.billet.client.NOMPERS || ''}`.trim()
            : 'Anonyme';
          const manifName = item.manifestation?.NOMMANIF || 'Événement';
          const isApproved = item.APPROUVERAVIS;
          const isProcessing = actionLoading === item.IDAVIS;

          return (
            <Card elevate p="$4" backgroundColor="white" borderRadius="$4" marginBottom="$3"
              borderWidth={1} borderColor={isApproved ? "$green4" : "$orange3"}
              opacity={isProcessing ? 0.6 : 1}
            >
              <YStack gap="$3">
                {/* Header */}
                <XStack justifyContent="space-between" alignItems="flex-start">
                  <YStack flex={1} gap="$1">
                    <Text fontWeight="700" fontSize={15}>{clientName}</Text>
                    <Text fontSize={12} color="$gray10">{manifName}</Text>
                  </YStack>
                  <YStack alignItems="flex-end" gap="$1">
                    {renderStars(item.NOTEAVIS)}
                    <View
                      backgroundColor={isApproved ? "$green2" : "$orange2"}
                      px="$2" py="$0.5" borderRadius="$2"
                    >
                      <Text fontSize={10} fontWeight="700" color={isApproved ? "$green10" : "$orange10"}>
                        {isApproved ? 'APPROUVÉ' : 'EN ATTENTE'}
                      </Text>
                    </View>
                  </YStack>
                </XStack>

                {/* Commentaire */}
                {item.COMMENTAIREAVIS ? (
                  <View backgroundColor="$gray2" p="$3" borderRadius="$3">
                    <Text fontSize={13} color="$gray11" lineHeight={20}>
                      "{item.COMMENTAIREAVIS}"
                    </Text>
                  </View>
                ) : (
                  <Text fontSize={12} color="$gray8" fontStyle="italic">Pas de commentaire</Text>
                )}

                {/* Actions */}
                <XStack gap="$2">
                  {!isApproved && (
                    <Button
                      flex={1}
                      size="$3"
                      backgroundColor="$green8"
                      color="white"
                      icon={<FontAwesome name="check" size={14} color="white" />}
                      onPress={() => handleApprove(item.IDAVIS)}
                      disabled={isProcessing}
                    >
                      Approuver
                    </Button>
                  )}
                  {isApproved && (
                    <Button
                      flex={1}
                      size="$3"
                      backgroundColor="$orange8"
                      color="white"
                      icon={<FontAwesome name="times" size={14} color="white" />}
                      onPress={() => handleReject(item.IDAVIS)}
                      disabled={isProcessing}
                    >
                      Retirer
                    </Button>
                  )}
                  <Button
                    size="$3"
                    backgroundColor="$red3"
                    color="$red10"
                    icon={<FontAwesome name="trash" size={14} color="#dc2626" />}
                    onPress={() => handleDelete(item.IDAVIS)}
                    disabled={isProcessing}
                  />
                </XStack>
              </YStack>
            </Card>
          );
        }}
        ListEmptyComponent={
          <YStack p="$10" alignItems="center" gap="$4" marginTop="$6">
            <FontAwesome name={filter === 'pending' ? "clock-o" : "star"} size={48} color="#ccc" />
            <Paragraph color="$gray10" textAlign="center">
              {filter === 'pending'
                ? "Aucun avis en attente de modération."
                : filter === 'approved'
                  ? "Aucun avis approuvé."
                  : "Aucun avis pour le moment."}
            </Paragraph>
          </YStack>
        }
      />
    </View>
  );
}
