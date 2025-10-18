// Types globaux de l'application Fytli
// ⚠️ Les noms correspondent EXACTEMENT à la structure de la base de données

export interface User {
  id: number;
  email: string;
  role?: 'user' | 'admin' | 'coach';  // ⭐ NOUVEAU - Rôle de l'utilisateur
  firstname: string;          // ⚠️ pas first_name
  lastname: string;           // ⚠️ pas last_name
  gender?: 'male' | 'female' | 'other';
  birthdate?: string;
  height_cm?: number;
  weight_kg?: number;
  goal?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstname: string;          // ⚠️ pas first_name
  lastname: string;           // ⚠️ pas last_name
}

export interface Program {
  id: number;
  user_id?: number;           // ⚠️ créateur du programme
  title: string;              // ⚠️ pas name
  description?: string;
  goal?: string;              // ⚠️ objectif du programme
  duration_weeks?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';  // ⚠️ pas difficulty_level
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  id: number;
  program_id: number;
  title: string;              // ⚠️ pas name
  order: number;              // ⚠️ Ordre de la session dans le programme
  day_number?: number;        // ⚠️ Alias pour compatibilité (même valeur que order)
  notes?: string;             // ⚠️ pas description
  created_at?: string;
}

export interface Exercise {
  id: number;
  name: string;
  type?: 'strength' | 'cardio' | 'stretch';
  muscle_group?: string;
  description?: string;
  video_url?: string;
  equipment?: string;
  created_at?: string;
}

export interface SessionExercise {
  id: number;
  session_id: number;
  exercise_id: number;
  sets: number;
  reps: number;
  rest_time_sec: number;
  order_index: number;
}

export interface UserProgress {
  id: number;
  user_id: number;
  date: string;
  weight_kg?: number;
  body_fat_percent?: number;
  muscle_mass_kg?: number;
  notes?: string;
}

export interface PulseTracking {
  id: number;
  user_id: number;
  bpm: number;
  recorded_at: string;
  mood?: 'energized' | 'tired' | 'neutral';
  activity_context?: 'rest' | 'training' | 'recovery';
}

export interface NutritionLog {
  id: number;
  user_id: number;
  date: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  notes?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

// =====================================================
// TYPES POUR LE SYSTÈME D'INSCRIPTION ET SUIVI
// =====================================================

export interface ProgramEnrollment {
  id: number;
  user_id: number;
  program_id: number;
  enrolled_at: string;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  // Données jointes
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
  sessions_completed?: number;
}

export interface SessionCompletion {
  id: number;
  user_id: number;
  program_id: number;
  session_id: number;
  completed_at: string;
  duration_minutes?: number;
  photo_url?: string;
  notes?: string;
  feeling?: 'terrible' | 'bad' | 'okay' | 'good' | 'excellent';
  // Données jointes
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  session_title?: string;
  session_order?: number;
  program_title?: string;
}

export interface EnrolledUser extends User {
  enrolled_at: string;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  sessions_completed: number;
}

export interface UserProgramStats {
  total_completions: number;
  unique_sessions_completed: number;
  total_minutes: number;
  last_completion: string | null;
}

export interface ProgramStats {
  total_enrolled: number;
  active_users: number;
  total_completions: number;
}

export interface UserProgramEnrollment extends Program {
  enrollment_id: number;
  enrolled_at: string;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  sessions_completed: number;
  total_sessions: number;
}
