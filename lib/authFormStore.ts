import { create } from 'zustand';

type AuthFormState = {
  mode: 'login' | 'register';
  email: string;
  password: string;
  password_confirmation: string;
  nom: string;
  prenom: string;
  tel: string;
  showPassword: boolean;
  setMode: (m: 'login' | 'register') => void;
  setField: (field: 'email' | 'password' | 'nom' | 'prenom' | 'tel' | 'password_confirmation', value: string) => void;
  toggleShowPassword: () => void;
  reset: () => void;
};

export const useAuthFormStore = create<AuthFormState>((set) => ({
  mode: 'login',
  email: '',
  password: '',
  password_confirmation: '',
  nom: '',
  prenom: '',
  tel: '',
  showPassword: false,
  setMode: (m) => set({ mode: m }),
  setField: (field, value) => set((s) => ({ ...s, [field]: value })),
  toggleShowPassword: () => set((s) => ({ showPassword: !s.showPassword })),
  reset: () => set({ 
    mode: 'login', 
    email: '', 
    password: '', 
    password_confirmation: '', 
    nom: '', 
    prenom: '', 
    tel: '', 
    showPassword: false 
  }),
}));

export default useAuthFormStore;
