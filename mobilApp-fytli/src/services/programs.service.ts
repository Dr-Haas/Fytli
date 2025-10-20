import api from './api';
import { Program } from '@/types/database';

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
  sessions_per_week?: number;
  category_id?: number;
  is_public?: boolean;
  goal?: string;
}

export const programsService = {
  async getAll(): Promise<Program[]> {
    const response = await api.get<ProgramsResponse>('/programs');
    return response.data.data;
  },

  async getById(id: number): Promise<Program> {
    const response = await api.get<ProgramResponse>(`/programs/${id}`);
    return response.data.data;
  },

  async getUserPrograms(userId: number): Promise<Program[]> {
    const response = await api.get<ProgramsResponse>(`/programs?created_by=${userId}`);
    return response.data.data;
  },

  async create(data: CreateProgramData): Promise<Program> {
    const backendPayload = {
      title: data.title,
      description: data.description,
      level: data.level,  // ✅ Corrigé - utilise 'level' maintenant
      duration_weeks: data.duration_weeks,
      sessions_per_week: data.sessions_per_week,
      category_id: data.category_id,
      is_public: data.is_public,
      goal: data.goal,
    };
    
    const response = await api.post<ProgramResponse>('/programs', backendPayload);
    return response.data.data;
  },

  async update(id: number, data: Partial<CreateProgramData>): Promise<Program> {
    const backendPayload = {
      title: data.title,
      description: data.description,
      level: data.level,  // ✅ Corrigé - utilise 'level' maintenant
      duration_weeks: data.duration_weeks,
      sessions_per_week: data.sessions_per_week,
      category_id: data.category_id,
      is_public: data.is_public,
      goal: data.goal,
    };
    
    const response = await api.put<ProgramResponse>(`/programs/${id}`, backendPayload);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/programs/${id}`);
  },
};

