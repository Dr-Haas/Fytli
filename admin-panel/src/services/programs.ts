import api from './api';
import { Program } from '@/types';

export const programsService = {
  // Récupérer tous les programmes
  getAll: async (): Promise<Program[]> => {
    const response = await api.get('/programs');
    return response.data.data || [];
  },

  // Récupérer un programme par ID
  getById: async (id: number): Promise<Program> => {
    const response = await api.get(`/programs/${id}`);
    return response.data.data;
  },

  // Créer un programme
  create: async (programData: Partial<Program>): Promise<Program> => {
    const response = await api.post('/programs', programData);
    return response.data.data;
  },

  // Modifier un programme
  update: async (id: number, programData: Partial<Program>): Promise<Program> => {
    const response = await api.put(`/programs/${id}`, programData);
    return response.data.data;
  },

  // Supprimer un programme
  delete: async (id: number): Promise<void> => {
    await api.delete(`/programs/${id}`);
  },

  // Récupérer les programmes par catégorie
  getByCategory: async (categoryId: number): Promise<Program[]> => {
    const response = await api.get(`/programs/category/${categoryId}`);
    return response.data.data || [];
  },
};

