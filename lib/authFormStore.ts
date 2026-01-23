import { create } from 'zustand';

type AuthFormState = {
  mode: 'login' | 'register';
  email: string;
  password: string;
  name?: string;
  showPassword: boolean;
  setMode: (m: 'login' | 'register') => void;
  setField: (field: 'email' | 'password' | 'name', value: string) => void;
  toggleShowPassword: () => void;
  reset: () => void;
};

export const useAuthFormStore = create<AuthFormState>((set) => ({
  mode: 'login',
  email: '',
  password: '',
  name: '',
  showPassword: false,
  setMode: (m) => set({ mode: m }),
  setField: (field, value) => set((s) => ({ ...s, [field]: value })),
  toggleShowPassword: () => set((s) => ({ showPassword: !s.showPassword })),
  reset: () => set({ mode: 'login', email: '', password: '', name: '', showPassword: false }),
}));

export default useAuthFormStore;
