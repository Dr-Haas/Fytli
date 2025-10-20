import api from './api';
import { ProgramEnrollment, UserProgramEnrollment, UserProgramStats } from '@/types/database';

interface EnrollmentResponse {
  success: boolean;
  data: ProgramEnrollment;
}

interface EnrollmentsResponse {
  success: boolean;
  data: UserProgramEnrollment[];
}

interface StatsResponse {
  success: boolean;
  data: UserProgramStats;
}

export const enrollmentsService = {
  async enroll(programId: number): Promise<ProgramEnrollment> {
    const response = await api.post<EnrollmentResponse>('/enrollments', { program_id: programId });
    return response.data.data;
  },

  async getUserEnrollments(userId: number): Promise<UserProgramEnrollment[]> {
    const response = await api.get<EnrollmentsResponse>(`/enrollments/user/${userId}/programs`);
    return response.data.data;
  },

  async getUsersByProgram(programId: number): Promise<ProgramEnrollment[]> {
    const response = await api.get<any>(`/enrollments/program/${programId}/users`);
    return response.data.data;
  },

  async checkEnrollment(programId: number): Promise<boolean> {
    const response = await api.get<any>(`/enrollments/check/${programId}`);
    return response.data.data.isEnrolled;
  },

  async getProgramStats(programId: number): Promise<any> {
    const response = await api.get<StatsResponse>(`/enrollments/program/${programId}/stats`);
    return response.data.data;
  },

  async updateStatus(programId: number, status: 'active' | 'paused' | 'completed' | 'abandoned'): Promise<ProgramEnrollment> {
    const response = await api.put<EnrollmentResponse>(`/enrollments/${programId}/status`, { status });
    return response.data.data;
  },

  async unenroll(programId: number): Promise<void> {
    await api.delete(`/enrollments/${programId}`);
  },
};

