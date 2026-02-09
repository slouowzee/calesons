import api from '../app/lib/api';

const ticketApi = {
  // --- Validation ---
  validateTicket: async (qrcode: string) => {
    // S'appuie sur POST /v1/billets/validate/:qrcode
    const response = await api.post(`/v1/billets/validate/${qrcode}`);
    return response.data;
  },
  
  // --- Récupération ---
  getTicketsByClient: async (clientId: string | number) => {
    // S'appuie sur GET /v1/billets/client/:clientId
    const response = await api.get(`/v1/billets/client/${clientId}`);
    return response.data; // Devrait être un tableau de billets
  },

  getTicketDetails: async (ticketId: string | number) => {
    const response = await api.get(`/v1/billets/${ticketId}`);
    return response.data;
  },

  // --- Création / Achat ---
  createReservation: async (manifestationId: string | number, nbPlaces: number, userId: string | number, paymentTypeId?: number) => {
    // Le backend attend précisément ces clés :
    // IDMANIF, IDPERS, NBPERSRESERVATION, IDTYPEPAIEMENT
    const payload: any = {
      IDMANIF: manifestationId,
      IDPERS: userId,
      NBPERSRESERVATION: nbPlaces
    };
    if (paymentTypeId) {
      payload.IDTYPEPAIEMENT = paymentTypeId;
    }
    const response = await api.post('/v1/reservations', payload);
    return response.data;
  },

  // Récupérer les réservations d'un client
  getReservationsByClient: async (clientId: string | number) => {
    const response = await api.get(`/v1/reservations/client/${clientId}`);
    return response.data;
  }
};

export default ticketApi;
