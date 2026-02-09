import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  let url = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';
  if (!url.startsWith('http')) {
    url = `http://${url}`;
  }
  return url.endsWith('/api') ? url : `${url}/api`;
};

const BASE_URL = getBaseUrl();

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-Key': process.env.EXPO_PUBLIC_API_KEY
  },
});

// Intercepteur pour injecter le token d'authentification automatiquement
api.interceptors.request.use(async (config) => {
  if (Platform.OS !== 'web') {
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
