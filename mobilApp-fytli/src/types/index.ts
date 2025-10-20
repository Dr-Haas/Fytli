// Types de navigation
export type RootStackParamList = {
  Home: undefined;
  // Ajoutez d'autres écrans ici
};

// Types d'utilisateur
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

// Types de programme
export interface Program {
  id: number;
  title: string;
  description: string;
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
  duration: number; // en semaines
  imageUrl?: string;
}

// Types de session
export interface Session {
  id: number;
  programId: number;
  title: string;
  description: string;
  duration: number; // en minutes
  exercises: Exercise[];
}

// Types d'exercice
export interface Exercise {
  id: number;
  name: string;
  description: string;
  sets?: number;
  reps?: number;
  duration?: number; // en secondes
  videoUrl?: string;
  imageUrl?: string;
}

// Types de progression
export interface Progress {
  id: number;
  userId: number;
  sessionId: number;
  completedAt: string;
  notes?: string;
}

// Types d'API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

