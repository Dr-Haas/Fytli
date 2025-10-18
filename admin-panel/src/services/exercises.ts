import { api } from './api';

export interface Exercise {
  id: number;
  name: string;
  description?: string;
  instructions?: string;
  category_id?: number;
  category_name?: string;
  difficulty_level: string;
  equipment_needed?: string;
  muscles_targeted?: string;
  video_url?: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateExerciseData {
  name: string;
  description?: string;
  instructions?: string;
  category_id?: number;
  difficulty_level: string;
  equipment_needed?: string;
  muscles_targeted?: string;
  video_url?: string;
  image_url?: string;
}

export interface UpdateExerciseData extends Partial<CreateExerciseData> {}

export const exercisesService = {
  // Récupérer tous les exercices
  async getAll(): Promise<Exercise[]> {
    const response = await api.get('/exercises');
    return response.data;
  },

  // Récupérer un exercice par ID
  async getById(id: number): Promise<Exercise> {
    const response = await api.get(`/exercises/${id}`);
    return response.data;
  },

  // Récupérer les exercices par catégorie
  async getByCategory(categoryId: number): Promise<Exercise[]> {
    const response = await api.get(`/exercises/category/${categoryId}`);
    return response.data;
  },

  // Créer un nouvel exercice
  async create(data: CreateExerciseData): Promise<Exercise> {
    const response = await api.post('/exercises', data);
    return response.data;
  },

  // Mettre à jour un exercice
  async update(id: number, data: UpdateExerciseData): Promise<Exercise> {
    const response = await api.put(`/exercises/${id}`, data);
    return response.data;
  },

  // Supprimer un exercice
  async delete(id: number): Promise<void> {
    await api.delete(`/exercises/${id}`);
  },
};

export default exercisesService;

