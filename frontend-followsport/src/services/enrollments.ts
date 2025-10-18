/**
 * Service pour gérer les inscriptions aux programmes
 */

import api from './api';
import type { ProgramEnrollment, ProgramStats, UserProgramEnrollment } from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

const enrollmentsService = {
  /**
   * S'inscrire à un programme
   */
  async enroll(programId: number): Promise<ProgramEnrollment> {
    const response = await api.post<ApiResponse<ProgramEnrollment>>('/enrollments', {
      program_id: programId,
    });
    return response.data.data;
  },

  /**
   * Se désinscrire d'un programme
   */
  async unenroll(programId: number): Promise<void> {
    await api.delete(`/enrollments/${programId}`);
  },

  /**
   * Mettre à jour le statut d'inscription
   */
  async updateStatus(
    programId: number,
    status: 'active' | 'paused' | 'completed' | 'abandoned'
  ): Promise<void> {
    await api.put(`/enrollments/${programId}/status`, { status });
  },

  /**
   * Récupérer les utilisateurs inscrits à un programme
   */
  async getUsersByProgram(programId: number): Promise<ProgramEnrollment[]> {
    const response = await api.get<ApiResponse<ProgramEnrollment[]>>(
      `/enrollments/program/${programId}/users`
    );
    return response.data.data;
  },

  /**
   * Récupérer les programmes d'un utilisateur
   */
  async getProgramsByUser(userId: number): Promise<UserProgramEnrollment[]> {
    const response = await api.get<ApiResponse<UserProgramEnrollment[]>>(
      `/enrollments/user/${userId}/programs`
    );
    return response.data.data;
  },

  /**
   * Vérifier si inscrit à un programme
   */
  async checkEnrollment(programId: number): Promise<boolean> {
    const response = await api.get<ApiResponse<{ enrolled: boolean }>>(
      `/enrollments/check/${programId}`
    );
    return response.data.data.enrolled;
  },

  /**
   * Récupérer les statistiques d'un programme
   */
  async getProgramStats(programId: number): Promise<ProgramStats> {
    const response = await api.get<ApiResponse<ProgramStats>>(
      `/enrollments/program/${programId}/stats`
    );
    return response.data.data;
  },
};

export default enrollmentsService;

