import api from './api';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types';

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

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  getStoredUser(): string | null {
    return localStorage.getItem('user');
  },

  storeAuth(token: string, user: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', user);
  },
};

