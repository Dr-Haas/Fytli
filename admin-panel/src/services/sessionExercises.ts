import api from './api';
import { SessionExercise } from '@/types';

export const sessionExercisesService = {
  // Récupérer tous les exercices d'une session
  getBySession: async (sessionId: number): Promise<SessionExercise[]> => {
    const response = await api.get(`/session-exercises?session_id=${sessionId}`);
    return response.data.data || [];
  },

  // Récupérer une association par ID
  getById: async (id: number): Promise<SessionExercise> => {
    const response = await api.get(`/session-exercises/${id}`);
    return response.data.data || response.data;
  },

  // Créer une nouvelle association
  create: async (data: Partial<SessionExercise>): Promise<SessionExercise> => {
    const response = await api.post('/session-exercises', data);
    return response.data.data || response.data;
  },

  // Modifier une association
  update: async (id: number, data: Partial<SessionExercise>): Promise<SessionExercise> => {
    const response = await api.put(`/session-exercises/${id}`, data);
    return response.data.data || response.data;
  },

  // Supprimer une association
  delete: async (id: number): Promise<void> => {
    await api.delete(`/session-exercises/${id}`);
  },
};

export default sessionExercisesService;

