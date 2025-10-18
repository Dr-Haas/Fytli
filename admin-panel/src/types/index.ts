// Types pour l'Admin Panel

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin' | 'coach';
  created_at: string;
  last_login?: string;
  enrollment_count?: number;
  session_count?: number;
}

export interface Program {
  id: number;
  title: string;
  description: string;
  difficulty_level: 'débutant' | 'intermédiaire' | 'avancé';
  duration_weeks: number;
  sessions_per_week: number;
  created_by: number;
  is_public: boolean;
  category_id: number;
  goal?: string;
  image_url?: string;
  created_at: string;
  category_name?: string;
  enrollment_count?: number;
  session_count?: number;
}

export interface Session {
  id: number;
  program_id: number;
  title: string;
  description: string;
  week_number: number;
  day_number: number;
  estimated_duration: number;
  exercises_count?: number;
  completion_count?: number;
}

export interface SessionCompletion {
  id: number;
  user_id: number;
  session_id: number;
  completed_at: string;
  duration_minutes?: number;
  notes?: string;
  photo_url?: string;
  user_name?: string;
  session_title?: string;
  program_title?: string;
}

export interface Exercise {
  id: number;
  name: string;
  description: string;
  category: string;
  difficulty_level: 'débutant' | 'intermédiaire' | 'avancé';
  equipment_needed?: string;
  video_url?: string;
  image_url?: string;
  created_at: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  condition_type: string;
  condition_value: number;
  created_at: string;
}

export interface UserBadge {
  id: number;
  user_id: number;
  badge_id: number;
  earned_at: string;
  badge_name?: string;
  badge_icon?: string;
  user_name?: string;
}

export interface Enrollment {
  id: number;
  user_id: number;
  program_id: number;
  enrolled_at: string;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'completed' | 'paused';
  progress_percentage?: number;
  user_name?: string;
  program_title?: string;
}

export interface Stats {
  total_users: number;
  total_programs: number;
  total_sessions: number;
  total_completions: number;
  active_enrollments: number;
  total_badges_earned: number;
  users_today: number;
  completions_today: number;
  recent_users?: User[];
  popular_programs?: Program[];
  recent_completions?: SessionCompletion[];
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

