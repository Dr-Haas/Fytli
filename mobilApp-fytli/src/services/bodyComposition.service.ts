import api from './api';
import { BodyComposition, BodyGoal } from '@/types/database';

interface BodyCompositionResponse {
  success: boolean;
  data: BodyComposition[];
}

interface SingleBodyCompositionResponse {
  success: boolean;
  data: BodyComposition;
}

interface BodyGoalResponse {
  success: boolean;
  data: BodyGoal[];
}

interface CreateBodyCompositionData {
  measurement_date: string;
  weight_kg: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  bmi?: number;
  waist_cm?: number;
  chest_cm?: number;
  arms_cm?: number;
  thighs_cm?: number;
  notes?: string;
}

interface CreateBodyGoalData {
  goal_type: 'weight_loss' | 'muscle_gain' | 'body_fat_reduction' | 'measurement';
  target_value: number;
  current_value: number;
  deadline?: string;
}

export const bodyCompositionService = {
  async getAll(): Promise<BodyComposition[]> {
    const response = await api.get<BodyCompositionResponse>('/body-composition');
    return response.data.data;
  },

  async create(data: CreateBodyCompositionData): Promise<BodyComposition> {
    const response = await api.post<SingleBodyCompositionResponse>('/body-composition', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<CreateBodyCompositionData>): Promise<BodyComposition> {
    const response = await api.put<SingleBodyCompositionResponse>(`/body-composition/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/body-composition/${id}`);
  },

  // Goals
  async getGoals(): Promise<BodyGoal[]> {
    const response = await api.get<BodyGoalResponse>('/body-composition/goals');
    return response.data.data;
  },

  async createGoal(data: CreateBodyGoalData): Promise<BodyGoal> {
    const response = await api.post<{success: boolean; data: BodyGoal}>('/body-composition/goals', data);
    return response.data.data;
  },

  async updateGoal(id: number, data: Partial<CreateBodyGoalData>): Promise<BodyGoal> {
    const response = await api.put<{success: boolean; data: BodyGoal}>(`/body-composition/goals/${id}`, data);
    return response.data.data;
  },

  async deleteGoal(id: number): Promise<void> {
    await api.delete(`/body-composition/goals/${id}`);
  },
};

