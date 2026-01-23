import { create } from 'zustand';

type User = { name?: string; email?: string } | null;

type AuthState = {
  isLoggedIn: boolean;
  user: User;
  login: (user?: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (user) => set({ isLoggedIn: true, user: user ?? null }),
  logout: () => set({ isLoggedIn: false, user: null }),
}));

export default useAuthStore;
