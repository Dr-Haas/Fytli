// Types globaux de l'application Fytli
// ⚠️ Les noms correspondent EXACTEMENT à la structure de la base de données

export interface User {
  id: number;
  email: string;
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
  duration_weeks?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';  // ⚠️ pas difficulty_level
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  id: number;
  program_id: number;
  title: string;              // ⚠️ pas name
  day_number: number;         // ⚠️ pas session_number
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
