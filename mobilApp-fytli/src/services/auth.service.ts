import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types/database';

// Fonction utilitaire : Transformer les données du backend vers le frontend
const transformUserFromBackend = (backendUser: any): User => {
  return {
    id: backendUser.id,
    email: backendUser.email,
    firstname: backendUser.first_name,   // Transformation
    lastname: backendUser.last_name,     // Transformation
    gender: backendUser.gender,
    birthdate: backendUser.birthdate,
    height_cm: backendUser.height_cm,
    weight_kg: backendUser.weight_kg,
    goal: backendUser.goal,
    avatar_url: backendUser.avatar_url,
    created_at: backendUser.created_at,
    updated_at: backendUser.updated_at,
  };
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<any>('/auth/login', credentials);
    
    // Transformer les données du backend
    return {
      token: response.data.token,
      user: transformUserFromBackend(response.data.user),
    };
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Transformer les noms de champs pour le backend (qui attend first_name/last_name)
    const backendPayload = {
      email: credentials.email,
      password: credentials.password,  // Le backend hashera le mot de passe
      first_name: credentials.firstname,  // Transformation
      last_name: credentials.lastname,    // Transformation
    };
    
    const response = await api.post<any>('/auth/register', backendPayload);
    
    // Transformer les données du backend
    return {
      token: response.data.token,
      user: transformUserFromBackend(response.data.user),
    };
  },

  async logout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  async getStoredToken(): Promise<string | null> {
    return await AsyncStorage.getItem('token');
  },

  async getStoredUser(): Promise<string | null> {
    return await AsyncStorage.getItem('user');
  },

  async storeAuth(token: string, user: string) {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', user);
  },
};

