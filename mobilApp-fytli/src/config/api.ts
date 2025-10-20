// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
};

// Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Users
  USER_PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  
  // Programs
  PROGRAMS: '/programs',
  PROGRAM_DETAIL: (id: number) => `/programs/${id}`,
  
  // Sessions
  SESSIONS: (programId: number) => `/programs/${programId}/sessions`,
  SESSION_DETAIL: (id: number) => `/sessions/${id}`,
  
  // Progress
  PROGRESS: '/progress',
  COMPLETE_SESSION: '/progress/complete',
  
  // Exercises
  EXERCISES: '/exercises',
  EXERCISE_DETAIL: (id: number) => `/exercises/${id}`,
};

