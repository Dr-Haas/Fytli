import api from './api';

export interface DailyScheduleSession {
  program_id: number;
  program_title: string;
  program_image: string | null;
  time_slot_start: string | null;
  time_slot_end: string | null;
  is_time_specific: boolean;
  session_id: number;
  session_title: string;
  session_description: string | null;
  target_duration_minutes: number | null;
  completed_today: boolean;
  completion_count: number;
}

export interface WeeklyScheduleProgram {
  program_id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  time_slot_start: string | null;
  time_slot_end: string | null;
  is_time_specific: boolean;
  sessions_per_week: number;
  sessions_completed_this_week: number;
  total_sessions: number;
}

export interface NextSession {
  session_id: number;
  title: string;
  description: string | null;
  target_duration_minutes: number | null;
  order_index: number;
}

export interface WeeklyStats {
  sessions_this_week: number;
  total_minutes_this_week: number;
  programs_active_this_week: number;
}

const scheduleService = {
  /**
   * Récupérer l'agenda du jour
   */
  async getDailySchedule(): Promise<DailyScheduleSession[]> {
    try {
      const response = await api.get('/schedule/daily');
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'agenda du jour:', error);
      return [];
    }
  },

  /**
   * Récupérer l'agenda de la semaine
   */
  async getWeeklySchedule(): Promise<WeeklyScheduleProgram[]> {
    try {
      const response = await api.get('/schedule/weekly');
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'agenda hebdomadaire:', error);
      return [];
    }
  },

  /**
   * Récupérer la prochaine session suggérée pour un programme
   */
  async getNextSession(programId: number): Promise<NextSession | null> {
    try {
      const response = await api.get(`/schedule/next-session/${programId}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la prochaine session:', error);
      return null;
    }
  },

  /**
   * Récupérer les statistiques de la semaine
   */
  async getWeeklyStats(): Promise<WeeklyStats> {
    try {
      const response = await api.get('/schedule/weekly-stats');
      return response.data.data || {
        sessions_this_week: 0,
        total_minutes_this_week: 0,
        programs_active_this_week: 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des stats hebdomadaires:', error);
      return {
        sessions_this_week: 0,
        total_minutes_this_week: 0,
        programs_active_this_week: 0
      };
    }
  },

  /**
   * Formater une heure au format HH:MM
   */
  formatTime(time: string | null): string {
    if (!time) return '';
    // time est au format "HH:MM:SS", on ne garde que HH:MM
    return time.substring(0, 5);
  },

  /**
   * Déterminer si un créneau est maintenant
   */
  isTimeSlotNow(startTime: string | null, endTime: string | null): boolean {
    if (!startTime || !endTime) return false;
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    return currentMinutes >= startTotalMinutes && currentMinutes <= endTotalMinutes;
  },

  /**
   * Déterminer si un créneau est passé
   */
  isTimeSlotPassed(endTime: string | null): boolean {
    if (!endTime) return false;
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    return currentMinutes > endTotalMinutes;
  }
};

export default scheduleService;

