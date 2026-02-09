import api from '../app/lib/api';

const ticketApi = {
  validateTickets: async (ticketIds: (number | string)[]) => {
    // On envoie le tableau d'IDs au backend pour validation
    // Structure supposée : POST /v1/billets/valider { ids: [...] }
    const response = await api.post('/v1/billets/valider', { 
      ids: ticketIds 
    });
    return response.data;
  },
  
  getTicketDetails: async (ticketId: string | number) => {
    const response = await api.get(`/v1/billets/${ticketId}`);
    return response.data.data;
  }
};

export default ticketApi;
