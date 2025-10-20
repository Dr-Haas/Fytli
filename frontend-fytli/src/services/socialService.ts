/**
 * Service pour gérer les fonctionnalités sociales du Cercle Fytli
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9001';

// Configuration axios avec token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// ============ TYPES ============

export interface Friend {
  id: number;
  name: string;
  username: string;
  email?: string;
  avatar_url?: string;
  profile_visibility: 'private' | 'friends' | 'public';
  feed_unlocked_today: boolean;
  unlocked_at?: string;
  connection_status?: string;
}

export interface FeedEvent {
  id: number;
  user_id: number;
  type: 'session_completed' | 'program_started' | 'streak_achieved' | 'goal_reached' | 'badge_earned';
  message: string;
  emoji?: string;
  metadata?: any;
  created_at: string;
  name: string;
  username: string;
  avatar_url?: string;
  duration?: number;
  average_heart_rate?: number;
  calories_burned?: number;
}

export interface CircleStats {
  user_status: {
    unlocked: boolean;
    streak: number;
    total_days: number;
  };
  circle: {
    total_friends: number;
    active_today: number;
    friends: Friend[];
  };
}

export interface PublicProfile {
  id: number;
  name: string;
  username: string;
  avatar_url?: string;
  profile_visibility: string;
  created_at: string;
  friends_count: number;
  total_sessions: number;
  badges_count: number;
  recent_badges?: any[];
}

export interface ShareCardData {
  user: {
    name: string;
    username: string;
    avatar_url?: string;
  };
  stats: {
    streak: number;
    total_days: number;
    friends_count: number;
  };
  status: {
    unlocked: boolean;
  };
  feed_event?: FeedEvent;
}

// ============ GESTION DES CONNEXIONS ============

/**
 * Envoyer une demande d'ami
 */
export const addFriend = async (friendId: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/social/connections/add`,
      { friendId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de l\'ajout d\'ami:', error);
    throw error.response?.data || error;
  }
};

/**
 * Accepter une demande d'ami
 */
export const acceptFriend = async (friendId: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/social/connections/accept`,
      { friendId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de l\'acceptation:', error);
    throw error.response?.data || error;
  }
};

/**
 * Supprimer un ami
 */
export const removeFriend = async (friendId: number) => {
  try {
    const response = await axios.delete(
      `${API_URL}/social/connections/${friendId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la suppression:', error);
    throw error.response?.data || error;
  }
};

/**
 * Récupérer la liste des amis
 */
export const getFriends = async (userId?: number): Promise<{ friends: Friend[], count: number }> => {
  try {
    const url = userId 
      ? `${API_URL}/social/connections/${userId}`
      : `${API_URL}/social/connections`;
    
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des amis:', error);
    throw error.response?.data || error;
  }
};

/**
 * Rechercher des utilisateurs
 */
export const searchUsers = async (query: string): Promise<{ users: Friend[], count: number }> => {
  try {
    const response = await axios.get(
      `${API_URL}/social/search?q=${encodeURIComponent(query)}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la recherche:', error);
    throw error.response?.data || error;
  }
};

// ============ GESTION DU FEED ============

/**
 * Récupérer le feed social
 */
export const getFeed = async (userId?: number, limit = 50, offset = 0): Promise<{ 
  locked: boolean; 
  message?: string; 
  feed: FeedEvent[];
  count: number;
}> => {
  try {
    const url = userId 
      ? `${API_URL}/social/feed/${userId}?limit=${limit}&offset=${offset}`
      : `${API_URL}/social/feed?limit=${limit}&offset=${offset}`;
    
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération du feed:', error);
    throw error.response?.data || error;
  }
};

/**
 * Déverrouiller le feed après une session
 */
export const unlockFeed = async (
  sessionCompletionId: number, 
  message?: string, 
  emoji?: string
): Promise<{ 
  message: string; 
  unlocked: boolean; 
  streak: number;
}> => {
  try {
    const response = await axios.post(
      `${API_URL}/social/feed/unlock`,
      { sessionCompletionId, message, emoji },
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors du déverrouillage:', error);
    throw error.response?.data || error;
  }
};

/**
 * Vérifier le statut du feed
 */
export const checkFeedStatus = async (): Promise<{ 
  unlocked: boolean; 
  unlocked_at?: string; 
  streak: number;
  total_days: number;
}> => {
  try {
    const response = await axios.get(
      `${API_URL}/social/feed/status`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la vérification du statut:', error);
    throw error.response?.data || error;
  }
};

/**
 * Récupérer les statistiques du cercle
 */
export const getCircleStats = async (): Promise<CircleStats> => {
  try {
    const response = await axios.get(
      `${API_URL}/social/circle`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des stats:', error);
    throw error.response?.data || error;
  }
};

// ============ PROFIL PUBLIC ============

/**
 * Récupérer un profil public par username
 */
export const getPublicProfile = async (username: string): Promise<{ profile: PublicProfile }> => {
  try {
    const response = await axios.get(
      `${API_URL}/social/profile/${username}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération du profil:', error);
    throw error.response?.data || error;
  }
};

// ============ GÉNÉRATION DE CARTE ============

/**
 * Obtenir les données pour générer une carte de partage
 */
export const getShareCardData = async (sessionCompletionId?: number): Promise<ShareCardData> => {
  try {
    const url = sessionCompletionId 
      ? `${API_URL}/social/share/card?sessionCompletionId=${sessionCompletionId}`
      : `${API_URL}/social/share/card`;
    
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la génération de la carte:', error);
    throw error.response?.data || error;
  }
};

