import api from './api';
import { SessionCompletion } from '@/types/database';

interface CompletionsResponse {
  success: boolean;
  data: SessionCompletion[];
}

interface CompletionResponse {
  success: boolean;
  data: SessionCompletion;
}

interface CreateCompletionData {
  program_id: number;
  session_id: number;
  duration_minutes?: number;
  notes?: string;
  feeling?: 'terrible' | 'bad' | 'okay' | 'good' | 'excellent';
  photo_url?: string;
}

export const completionsService = {
  async create(data: CreateCompletionData): Promise<SessionCompletion> {
    const response = await api.post<CompletionResponse>('/completions', data);
    return response.data.data;
  },

  async complete(data: CreateCompletionData): Promise<SessionCompletion> {
    // Alias pour create
    return this.create(data);
  },

  async getByUser(userId: number): Promise<SessionCompletion[]> {
    const response = await api.get<CompletionsResponse>(`/completions/user/${userId}`);
    return response.data.data;
  },

  async getUserCompletions(): Promise<SessionCompletion[]> {
    // Alias pour getByUser - nécessite l'ID utilisateur
    const response = await api.get<CompletionsResponse>('/completions/user');
    return response.data.data;
  },

  async getProgramCompletions(programId: number): Promise<SessionCompletion[]> {
    const response = await api.get<CompletionsResponse>(`/completions/program/${programId}`);
    return response.data.data;
  },

  async getProgramActivityFeed(programId: number, limit: number = 10): Promise<SessionCompletion[]> {
    const response = await api.get<CompletionsResponse>(`/completions/feed/${programId}?limit=${limit}`);
    return response.data.data;
  },

  async getById(id: number): Promise<SessionCompletion> {
    const response = await api.get<CompletionResponse>(`/completions/${id}`);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/completions/${id}`);
  },
};

