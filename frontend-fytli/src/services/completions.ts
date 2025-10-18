/**
 * Service pour gérer les sessions complétées
 */

import api from './api';
import type { SessionCompletion, UserProgramStats } from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

interface CreateCompletionData {
  program_id: number;
  session_id: number;
  duration_minutes?: number;
  photo_url?: string;
  notes?: string;
  feeling?: 'terrible' | 'bad' | 'okay' | 'good' | 'excellent';
}

const completionsService = {
  /**
   * Enregistrer une session complétée
   */
  async create(data: CreateCompletionData): Promise<SessionCompletion> {
    const response = await api.post<ApiResponse<SessionCompletion>>('/completions', data);
    return response.data.data;
  },

  /**
   * Récupérer les completions d'un utilisateur
   */
  async getByUser(userId: number): Promise<SessionCompletion[]> {
    const response = await api.get<ApiResponse<SessionCompletion[]>>(
      `/completions/user/${userId}`
    );
    return response.data.data;
  },

  /**
   * Récupérer les completions d'un programme
   */
  async getByProgram(programId: number): Promise<SessionCompletion[]> {
    const response = await api.get<ApiResponse<SessionCompletion[]>>(
      `/completions/program/${programId}`
    );
    return response.data.data;
  },

  /**
   * Récupérer les completions d'une session
   */
  async getBySession(sessionId: number): Promise<SessionCompletion[]> {
    const response = await api.get<ApiResponse<SessionCompletion[]>>(
      `/completions/session/${sessionId}`
    );
    return response.data.data;
  },

  /**
   * Récupérer une completion par ID
   */
  async getById(id: number): Promise<SessionCompletion> {
    const response = await api.get<ApiResponse<SessionCompletion>>(`/completions/${id}`);
    return response.data.data;
  },

  /**
   * Supprimer une completion
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/completions/${id}`);
  },

  /**
   * Récupérer les stats utilisateur/programme
   */
  async getUserProgramStats(userId: number, programId: number): Promise<UserProgramStats> {
    const response = await api.get<ApiResponse<UserProgramStats>>(
      `/completions/stats/${userId}/${programId}`
    );
    return response.data.data;
  },

  /**
   * Récupérer le feed d'activité d'un programme
   */
  async getProgramActivityFeed(programId: number, limit = 20): Promise<SessionCompletion[]> {
    const response = await api.get<ApiResponse<SessionCompletion[]>>(
      `/completions/feed/${programId}?limit=${limit}`
    );
    return response.data.data;
  },
};

export default completionsService;

