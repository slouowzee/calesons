import api from '../app/lib/api';

const authApi = {
  login: async ({ email, password }: { email: string; password: string }) => {
    // placeholder - call real API
    // return api.post('/auth/login', { email, password }).then(r => r.data);
    return new Promise<{ user: { name: string; email: string } }>((res) =>
      setTimeout(() => res({ user: { name: 'Mock', email } }), 600)
    );
  },
  register: async ({ name, email, password }: { name?: string; email: string; password: string }) => {
    // placeholder
    return new Promise<{ user: { name: string; email: string } }>((res) =>
      setTimeout(() => res({ user: { name: name ?? 'NewUser', email } }), 800)
    );
  },
};

export default authApi;
