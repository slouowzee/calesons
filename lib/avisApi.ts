import api from '../app/lib/api';

const avisApi = {
  // Récupérer les avis approuvés pour une manifestation (public)
  getByManifestation: async (manifId: string | number) => {
    const response = await api.get(`/v1/avis/manifestation/${manifId}`);
    return response.data;
  },

  // Créer un avis (utilisateur authentifié)
  create: async (billetId: number, manifId: number, note: number, commentaire?: string) => {
    const response = await api.post('/v1/avis', {
      IDBILLET: billetId,
      IDMANIF: manifId,
      NOTEAVIS: note,
      COMMENTAIREAVIS: commentaire || null,
    });
    return response.data;
  },

  // Récupérer les avis d'un client
  getByClient: async (clientId: string | number) => {
    const response = await api.get(`/v1/avis/client/${clientId}`);
    return response.data;
  },

  // --- Admin ---
  // Récupérer tous les avis (admin)
  getAll: async () => {
    const response = await api.get('/v1/avis');
    return response.data;
  },

  // Approuver un avis (admin)
  approve: async (avisId: number) => {
    const response = await api.post(`/v1/avis/${avisId}/approve`);
    return response.data;
  },

  // Rejeter un avis (admin)
  reject: async (avisId: number) => {
    const response = await api.post(`/v1/avis/${avisId}/reject`);
    return response.data;
  },

  // Supprimer un avis (admin ou propriétaire)
  delete: async (avisId: number) => {
    const response = await api.delete(`/v1/avis/${avisId}`);
    return response.data;
  },
};

export default avisApi;
