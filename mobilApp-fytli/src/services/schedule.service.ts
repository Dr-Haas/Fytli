import api from './api';
import { Session } from '@/types/database';

interface DailyScheduleResponse {
  success: boolean;
  data: {
    sessions: Session[];
    date: string;
  };
}

interface WeeklyScheduleResponse {
  success: boolean;
  data: {
    weekSessions: { [key: string]: Session[] };
    startDate: string;
    endDate: string;
  };
}

interface NextSessionResponse {
  success: boolean;
  data: Session | null;
}

interface WeeklyStatsResponse {
  success: boolean;
  data: {
    totalSessions: number;
    completedSessions: number;
    missedSessions: number;
    percentage: number;
  };
}

export const scheduleService = {
  async getDailySchedule(date?: string): Promise<any> {
    const params = date ? `?date=${date}` : '';
    const response = await api.get<DailyScheduleResponse>(`/schedule/daily${params}`);
    return response.data.data;
  },

  async getWeeklySchedule(startDate?: string): Promise<any> {
    const params = startDate ? `?startDate=${startDate}` : '';
    const response = await api.get<WeeklyScheduleResponse>(`/schedule/weekly${params}`);
    return response.data.data;
  },

  async getNextSession(programId: number): Promise<Session | null> {
    const response = await api.get<NextSessionResponse>(`/schedule/next-session/${programId}`);
    return response.data.data;
  },

  async getWeeklyStats(startDate?: string): Promise<any> {
    const params = startDate ? `?startDate=${startDate}` : '';
    const response = await api.get<WeeklyStatsResponse>(`/schedule/weekly-stats${params}`);
    return response.data.data;
  },
};

