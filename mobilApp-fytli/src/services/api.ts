import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:9001';

// Instance Axios configurée
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT automatiquement
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${url}`, error.response?.data || error.message);
    
    // Ne déconnecter QUE si c'est une vraie erreur d'authentification sur les endpoints critiques
    if (status === 401) {
      const isAuthEndpoint = url?.includes('/auth/') || url?.includes('/users/me');
      
      if (isAuthEndpoint) {
        console.warn('🚪 Token invalide détecté - Déconnexion de l\'utilisateur');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        // TODO: Navigation vers login ou émission d'un événement
      } else {
        console.warn(`⚠️ 401 sur ${url} - Token possiblement expiré, mais on ne déconnecte pas automatiquement`);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

