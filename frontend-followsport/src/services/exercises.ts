import api from './api';
import { Exercise } from '../types';

interface ExercisesResponse {
  success: boolean;
  count?: number;
  data: Exercise[];
}

interface ExerciseResponse {
  success: boolean;
  data: Exercise;
}

export const exercisesService = {
  async getAll(): Promise<Exercise[]> {
    const response = await api.get<ExercisesResponse>('/exercises');
    return response.data.data;
  },

  async getById(id: number): Promise<Exercise> {
    const response = await api.get<ExerciseResponse>(`/exercises/${id}`);
    return response.data.data;
  },

  async getByCategory(categoryId: number): Promise<Exercise[]> {
    const response = await api.get<ExercisesResponse>(`/exercises?category_id=${categoryId}`);
    return response.data.data;
  },
};

