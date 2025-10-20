import api from './api';

export interface Progress {
  id: number;
  user_id: number;
  program_id?: number;
  metric_name: string;
  metric_value: number;
  measurement_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface ProgressResponse {
  success: boolean;
  data: Progress[];
}

interface SingleProgressResponse {
  success: boolean;
  data: Progress;
}

interface CreateProgressData {
  program_id?: number;
  metric_name: string;
  metric_value: number;
  measurement_date?: string;
  notes?: string;
}

export const progressService = {
  async getAll(userId?: number): Promise<Progress[]> {
    const params = userId ? `?user_id=${userId}` : '';
    const response = await api.get<ProgressResponse>(`/progress${params}`);
    return response.data.data;
  },

  async getById(id: number): Promise<Progress> {
    const response = await api.get<SingleProgressResponse>(`/progress/${id}`);
    return response.data.data;
  },

  async create(data: CreateProgressData): Promise<Progress> {
    const response = await api.post<SingleProgressResponse>('/progress', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<CreateProgressData>): Promise<Progress> {
    const response = await api.put<SingleProgressResponse>(`/progress/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/progress/${id}`);
  },
};

