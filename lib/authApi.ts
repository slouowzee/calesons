import api from '../app/lib/api';

const authApi = {
  login: async ({ email, password }: { email: string; password: string }) => {
    // Note: Le backend semble utiliser MAILCLIENT même pour le login d'après la structure Client
    const response = await api.post('/v1/login', { 
      MAILCLIENT: email, 
      password 
    });
    return {
      user: response.data.data.client,
      token: response.data.data.access_token
    };
  },
  register: async (data: { 
    nom: string; 
    prenom: string; 
    email: string; 
    tel: string; 
    password: string; 
    password_confirmation: string 
  }) => {
    const response = await api.post('/v1/register', {
      NOMPERS: data.nom,
      PRENOMPERS: data.prenom,
      MAILCLIENT: data.email,
      TELCLIENT: data.tel,
      password: data.password,
      password_confirmation: data.password_confirmation
    });
    return {
      user: response.data.data.client,
      token: response.data.data.access_token
    };
  },
  getMe: async (token: string) => {
    const response = await api.get('/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Fallback: on essaie de trouver le client dans .data.client, .data.user ou directement .data
    const userData = response.data.data?.client || response.data.data?.user || response.data.data || response.data.client || response.data;
    return userData;
  },
  logout: async (token: string) => {
    const response = await api.post('/v1/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  updateProfile: async (data: { 
    nom: string; 
    prenom: string; 
    email: string; 
    tel: string; 
  }) => {
    const rawTel = data.tel.replace(/\D/g, '');
    
    // Passage en méthode PUT explicite comme demandé
    const payload: any = {
      NOMPERS: data.nom,
      PRENOMPERS: data.prenom,
      MAILCLIENT: data.email,
      TELCLIENT: rawTel,
    };

    const response = await api.put('/v1/me', payload);
    return response.data;
  },

  changePassword: async (data: { 
    current_password: string; 
    new_password: string; 
    new_password_confirmation: string 
  }) => {
    const response = await api.post('/v1/change-password', data);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/v1/me');
    return response.data;
  }
};

export default authApi;
