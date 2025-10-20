import api from './api';
import { User } from '@/types/database';

interface UserResponse {
  success: boolean;
  data: User;
}

interface UsersResponse {
  success: boolean;
  data: User[];
}

interface UserStatsResponse {
  success: boolean;
  data: {
    total_sessions: number;
    total_duration_minutes: number;
    current_streak: number;
    longest_streak: number;
    total_programs: number;
    active_programs: number;
  };
}

export const usersService = {
  async getById(userId: number): Promise<User> {
    const response = await api.get<UserResponse>(`/users/${userId}`);
    return response.data.data;
  },

  async getAll(): Promise<User[]> {
    const response = await api.get<UsersResponse>('/users');
    return response.data.data;
  },

  async updateProfile(userId: number, data: Partial<User>): Promise<User> {
    const response = await api.put<UserResponse>(`/users/${userId}`, data);
    return response.data.data;
  },

  async getUserStats(userId: number): Promise<any> {
    const response = await api.get<UserStatsResponse>(`/badges/user/${userId}/stats`);
    return response.data.data;
  },
};

