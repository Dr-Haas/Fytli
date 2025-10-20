import api from './api';
import { Program } from '@/types';

// Le backend utilise 'level' avec valeurs anglaises
// On normalise tout pour être cohérent
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
    // Transformation pour le backend : utiliser 'level' au lieu de 'difficulty_level'
    const backendData: any = {
      ...programData,
      level: programData.level || programData.difficulty_level || 'beginner',
    };
    
    // Supprimer difficulty_level si présent
    delete backendData.difficulty_level;
    
    const response = await api.post('/programs', backendData);
    return response.data.data;
  },

  // Modifier un programme
  update: async (id: number, programData: Partial<Program>): Promise<Program> => {
    // Transformation pour le backend : utiliser 'level' au lieu de 'difficulty_level'
    const backendData: any = {
      ...programData,
      level: programData.level || programData.difficulty_level || 'beginner',
    };
    
    // Supprimer difficulty_level si présent
    delete backendData.difficulty_level;
    
    const response = await api.put(`/programs/${id}`, backendData);
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

