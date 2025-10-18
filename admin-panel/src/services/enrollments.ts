import api from './api';
import { Enrollment } from '@/types';

export const enrollmentsService = {
  // Récupérer toutes les inscriptions
  getAll: async (): Promise<Enrollment[]> => {
    const response = await api.get('/enrollments');
    return response.data.data || [];
  },

  // Récupérer les inscriptions d'un utilisateur
  getByUser: async (userId: number): Promise<Enrollment[]> => {
    const response = await api.get(`/enrollments/user/${userId}`);
    return response.data.data || [];
  },

  // Récupérer les inscriptions d'un programme
  getByProgram: async (programId: number): Promise<Enrollment[]> => {
    const response = await api.get(`/enrollments/program/${programId}`);
    return response.data.data || [];
  },

  // Supprimer une inscription
  delete: async (id: number): Promise<void> => {
    await api.delete(`/enrollments/${id}`);
  },
};

