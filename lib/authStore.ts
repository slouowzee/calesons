import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type User = { 
  id?: number | string;
  NOMPERS?: string;
  PRENOMPERS?: string;
  MAILCLIENT?: string;
  TELCLIENT?: string;
  TELPERS?: string;
  ROLEPERS?: string;
  is_admin?: boolean;
  reservations?: any[];
  billets?: any[];
} | null;

type AuthState = {
  isLoggedIn: boolean;
  user: User;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  token: null,
  setAuth: (user, token) => {
    if (Platform.OS !== 'web') {
      SecureStore.setItemAsync('auth_token', token);
    }
    set({ isLoggedIn: true, user, token });
  },
  logout: () => {
    if (Platform.OS !== 'web') {
      SecureStore.deleteItemAsync('auth_token');
    }
    set({ isLoggedIn: false, user: null, token: null });
  },
}));

export default useAuthStore;
