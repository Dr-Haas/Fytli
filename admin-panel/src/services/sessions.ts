import api from './api';
import { Session, SessionCompletion } from '@/types';

export const sessionsService = {
  // Récupérer toutes les sessions
  getAll: async (): Promise<Session[]> => {
    const response = await api.get('/sessions');
    return response.data.data || [];
  },

  // Récupérer les sessions d'un programme
  getByProgram: async (programId: number): Promise<Session[]> => {
    const response = await api.get(`/programs/${programId}/sessions`);
    return response.data.data || [];
  },

  // Récupérer une session par ID
  getById: async (id: number): Promise<Session> => {
    const response = await api.get(`/sessions/${id}`);
    return response.data.data;
  },

  // Créer une session
  create: async (sessionData: Partial<Session>): Promise<Session> => {
    const response = await api.post('/sessions', sessionData);
    return response.data.data;
  },

  // Modifier une session
  update: async (id: number, sessionData: Partial<Session>): Promise<Session> => {
    const response = await api.put(`/sessions/${id}`, sessionData);
    return response.data.data;
  },

  // Supprimer une session
  delete: async (id: number): Promise<void> => {
    await api.delete(`/sessions/${id}`);
  },

  // Récupérer toutes les complétions (via route admin)
  getAllCompletions: async (): Promise<SessionCompletion[]> => {
    const response = await api.get('/admin/completions');
    return response.data.data || [];
  },

  // Récupérer les complétions d'un utilisateur
  getUserCompletions: async (userId: number): Promise<SessionCompletion[]> => {
    const response = await api.get(`/completions/user/${userId}`);
    return response.data.data || [];
  },
};

