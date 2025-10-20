import api from './api';
import { Exercise } from '@/types/database';

interface ExercisesResponse {
  success: boolean;
  data: Exercise[];
}

interface ExerciseResponse {
  success: boolean;
  data: Exercise;
}

interface CreateExerciseData {
  name: string;
  type?: 'strength' | 'cardio' | 'stretch';
  muscle_group?: string;
  description?: string;
  video_url?: string;
  equipment?: string;
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

  async search(query: string): Promise<Exercise[]> {
    const response = await api.get<ExercisesResponse>(`/exercises/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  },

  async getByType(type: 'strength' | 'cardio' | 'stretch'): Promise<Exercise[]> {
    const response = await api.get<ExercisesResponse>(`/exercises?type=${type}`);
    return response.data.data;
  },

  async create(data: CreateExerciseData): Promise<Exercise> {
    const response = await api.post<ExerciseResponse>('/exercises', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<CreateExerciseData>): Promise<Exercise> {
    const response = await api.put<ExerciseResponse>(`/exercises/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/exercises/${id}`);
  },
};

