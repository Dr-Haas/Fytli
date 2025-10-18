import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PublicStats {
  users: number;
  programs: number;
  exercises: number;
  badges: number;
  sessions: number;
}

export const getPublicStats = async (): Promise<PublicStats | null> => {
  try {
    const response = await api.get('/public/stats');
    if (response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    return null;
  }
};

