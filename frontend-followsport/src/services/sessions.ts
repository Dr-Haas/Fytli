import api from './api';
import { Session, SessionExercise } from '../types';

interface SessionsResponse {
  success: boolean;
  count?: number;
  data: Session[];
}

interface SessionResponse {
  success: boolean;
  data: Session;
}

interface CreateSessionData {
  program_id: number;
  title: string;
  day_number: number;
  notes?: string;
}

interface AddExerciseToSessionData {
  session_id: number;
  exercise_id: number;
  sets: number;
  reps: number;
  rest_time_sec: number;
  order_index: number;
}

export const sessionsService = {
  async getByProgramId(programId: number): Promise<Session[]> {
    const response = await api.get<SessionsResponse>(`/programs/${programId}/sessions`);
    return response.data.data;
  },

  async getById(id: number): Promise<Session> {
    const response = await api.get<SessionResponse>(`/sessions/${id}`);
    return response.data.data;
  },

  async create(data: CreateSessionData): Promise<Session> {
    const response = await api.post<SessionResponse>('/sessions', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<CreateSessionData>): Promise<Session> {
    const response = await api.put<SessionResponse>(`/sessions/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/sessions/${id}`);
  },

  async addExercise(data: AddExerciseToSessionData): Promise<SessionExercise> {
    const response = await api.post('/session-exercises', data);
    return response.data.data;
  },

  async removeExercise(sessionExerciseId: number): Promise<void> {
    await api.delete(`/session-exercises/${sessionExerciseId}`);
  },
};

