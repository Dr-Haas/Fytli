// Types de base de données Fytli - Identiques au frontend
// ⚠️ Les noms correspondent EXACTEMENT à la structure de la base de données

export interface User {
  id: number;
  email: string;
  role?: 'user' | 'admin' | 'coach';
  firstname: string;          // ⚠️ pas first_name
  lastname: string;           // ⚠️ pas last_name
  gender?: 'male' | 'female' | 'other';
  birthdate?: string;
  height_cm?: number;
  weight_kg?: number;
  goal?: string;
  avatar_url?: string;
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
  sessions_per_week?: number; // ⚠️ nombre de sessions par semaine
  category_id?: number;       // ⚠️ catégorie du programme
  is_public?: boolean;        // ⚠️ programme visible publiquement
  image_url?: string;
  goal?: string;              // ⚠️ objectif du programme
  time_slot_start?: string;   // ⚠️ heure de début (format HH:MM:SS)
  time_slot_end?: string;     // ⚠️ heure de fin (format HH:MM:SS)
  is_time_specific?: boolean; // ⚠️ si le programme a un créneau horaire fixe
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  id: number;
  program_id: number;
  title: string;              // ⚠️ pas name
  order?: number;             // ⚠️ Ordre de la session (deprecated, utiliser order_index)
  order_index?: number;       // ⚠️ Ordre de la session dans le programme (nom correct dans la DB)
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
  exercise?: Exercise;        // ⚠️ Exercice joint
  sets: number;
  reps: number;
  duration_seconds?: number;      // ⚠️ Durée de l'exercice en secondes (pour cardio)
  rest_time_sec: number;          // ⚠️ Temps de repos en secondes
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
  program_id: number;  // ⚠️ ID du programme (pour navigation)
  program_title?: string;  // ⚠️ Titre du programme
  program_level?: string;  // ⚠️ Niveau du programme
  enrolled_at: string;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  sessions_completed: number;
  total_sessions: number;
}

// =====================================================
// OBJECTIFS HEBDOMADAIRES
// =====================================================

export type WeeklyGoalType = 
  | 'workouts'          // Nombre de séances
  | 'duration'          // Durée totale (minutes)
  | 'exercises'         // Nombre d'exercices
  | 'streak'            // Jours consécutifs
  | 'programs'          // Programmes spécifiques
  | 'sessions';         // Sessions spécifiques

export interface WeeklyGoal {
  id: number;
  user_id: number;
  week_start_date: string;
  goal_type: WeeklyGoalType;
  goal_target: number;
  goal_current: number;
  goal_achieved: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Données supplémentaires selon le type
  target_programs?: number[];      // IDs des programmes à compléter
  target_sessions?: number[];      // IDs des sessions à compléter
  description?: string;            // Description personnalisée
}

export interface WeeklyGoalProgress {
  goal: WeeklyGoal;
  progress_percent: number;
  remaining: number;
  days_left: number;
  is_achievable: boolean;
  streak_current?: number;
  streak_required?: number;
}

export interface CreateWeeklyGoalData {
  goal_type: WeeklyGoalType;
  goal_target: number;
  target_programs?: number[];
  target_sessions?: number[];
  description?: string;
}

// =====================================================
// BADGES
// =====================================================

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon_url?: string;
  icon_emoji?: string;
  condition_type: 'streak' | 'total_workouts' | 'program_completion' | 'body_composition';
  condition_value: number;
  created_at?: string;
}

export interface UserBadge {
  id: number;
  user_id: number;
  badge_id: number;
  earned_at: string;
  // Badge joint
  badge?: Badge;
  // Champs dénormalisés depuis Badge (pour faciliter l'affichage)
  name?: string;
  icon?: string;
  color?: string;
  gradient?: string;
}

// =====================================================
// COMPOSITION CORPORELLE
// =====================================================

export interface BodyComposition {
  id: number;
  user_id: number;
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
  created_at?: string;
}

export interface BodyGoal {
  id: number;
  user_id: number;
  goal_type: 'weight_loss' | 'muscle_gain' | 'body_fat_reduction' | 'measurement';
  target_value: number;
  current_value: number;
  deadline?: string;
  is_achieved: boolean;
  created_at?: string;
  updated_at?: string;
}

// =====================================================
// SOCIAL FEATURES
// =====================================================

export interface UserFollow {
  id: number;
  follower_id: number;      // Celui qui suit
  following_id: number;     // Celui qui est suivi
  created_at: string;
}

export interface SocialFeedItem {
  id: number;
  user_id: number;
  type: 'completion' | 'badge' | 'program_enrollment' | 'goal_achieved';
  content: string;
  related_id?: number;      // ID de l'entité liée (completion_id, badge_id, etc.)
  created_at: string;
  // Données utilisateur jointes
  firstname?: string;
  lastname?: string;
  avatar_url?: string;
}

// =====================================================
// NOTIFICATIONS
// =====================================================

export interface PushSubscription {
  id: number;
  user_id: number;
  subscription_data: string;  // JSON stringifié
  created_at: string;
}

export interface NotificationSettings {
  id: number;
  user_id: number;
  push_enabled: boolean;
  email_enabled: boolean;
  workout_reminders: boolean;
  social_notifications: boolean;
  badge_notifications: boolean;
  goal_reminders: boolean;
  created_at?: string;
  updated_at?: string;
}

// =====================================================
// SCHEDULE / PLANIFICATION
// =====================================================

export interface DailySchedule {
  id: number;
  user_id: number;
  program_id: number;
  session_id: number;
  scheduled_date: string;
  scheduled_time?: string;
  status: 'planned' | 'completed' | 'missed' | 'rescheduled';
  completed_at?: string;
  created_at?: string;
}

