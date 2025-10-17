import api from './api';
import { Program } from '../types';

interface ProgramsResponse {
  success: boolean;
  count?: number;
  data: Program[];
}

interface ProgramResponse {
  success: boolean;
  data: Program;
}

interface CreateProgramData {
  title: string;
  description?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks?: number;
}

export const programsService = {
  async getAll(): Promise<Program[]> {
    const response = await api.get<ProgramsResponse>('/programs');
    // Le backend retourne { success, count, data }, on extrait data
    return response.data.data;
  },

  async getById(id: number): Promise<Program> {
    const response = await api.get<ProgramResponse>(`/programs/${id}`);
    // Le backend retourne { success, data }, on extrait data
    return response.data.data;
  },

  async getUserPrograms(userId: number): Promise<Program[]> {
    const response = await api.get<ProgramsResponse>(`/programs?created_by=${userId}`);
    return response.data.data;
  },

  async create(data: CreateProgramData): Promise<Program> {
    // Le backend attend "name" mais la DB a "title", on transforme
    const backendPayload = {
      name: data.title,  // Transformation title -> name pour le backend
      description: data.description,
      difficulty_level: data.level,
      duration_weeks: data.duration_weeks,
    };
    
    const response = await api.post<ProgramResponse>('/programs', backendPayload);
    return response.data.data;
  },

  async update(id: number, data: Partial<CreateProgramData>): Promise<Program> {
    const backendPayload = {
      name: data.title,
      description: data.description,
      difficulty_level: data.level,
      duration_weeks: data.duration_weeks,
    };
    
    const response = await api.put<ProgramResponse>(`/programs/${id}`, backendPayload);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/programs/${id}`);
  },
};

