import api from './api';
import { User } from '@/types/database';

interface Connection {
  id: number;
  user_id: number;
  friend_id: number;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
}

interface FriendWithDetails extends Connection {
  friend: User;
}

interface FeedEvent {
  id: number;
  user_id: number;
  type: 'session_completed' | 'program_started' | 'streak_achieved' | 'goal_reached' | 'badge_earned';
  message: string;
  emoji?: string;
  metadata?: any;
  created_at: string;
  user: User;
}

interface PublicProfile {
  user: User;
  stats: {
    total_sessions: number;
    current_streak: number;
    total_badges: number;
  };
  badges: Array<{
    id: number;
    name: string;
    icon: string;
    description: string;
  }>;
  recentActivity: FeedEvent[];
  isConnected: boolean;
  connectionStatus?: 'pending' | 'accepted' | 'none';
}

export const socialService = {
  // ============ GESTION DES CONNEXIONS (AMIS) ============
  
  /**
   * Envoyer une demande d'ami
   */
  async addFriend(friendId: number): Promise<{connectionId: number}> {
    const response = await api.post<{success: boolean; connectionId: number; message: string}>(
      '/social/connections/add',
      { friendId }
    );
    return { connectionId: response.data.connectionId };
  },

  /**
   * Accepter une demande d'ami
   */
  async acceptFriend(friendId: number): Promise<void> {
    await api.post('/social/connections/accept', { friendId });
  },

  /**
   * Supprimer une connexion (ami)
   */
  async removeFriend(friendId: number): Promise<void> {
    await api.delete(`/social/connections/${friendId}`);
  },

  /**
   * Récupérer la liste de ses amis
   */
  async getFriends(userId?: number): Promise<FriendWithDetails[]> {
    const url = userId ? `/social/connections/${userId}` : '/social/connections';
    const response = await api.get<{success: boolean; friends: FriendWithDetails[]; count: number}>(url);
    return response.data.friends;
  },

  /**
   * Rechercher des utilisateurs
   */
  async searchUsers(query: string): Promise<User[]> {
    const response = await api.get<{success: boolean; users: User[]; count: number}>(
      `/social/search?q=${encodeURIComponent(query)}`
    );
    return response.data.users;
  },

  // ============ GESTION DU FEED ============

  /**
   * Récupérer le feed social (activités des amis)
   */
  async getFeed(userId?: number, limit = 50, offset = 0): Promise<FeedEvent[]> {
    const url = userId 
      ? `/social/feed/${userId}?limit=${limit}&offset=${offset}`
      : `/social/feed?limit=${limit}&offset=${offset}`;
    
    const response = await api.get<{
      success: boolean;
      locked?: boolean;
      feed: FeedEvent[];
      count: number;
    }>(url);
    
    return response.data.feed || [];
  },

  /**
   * Déverrouiller le feed après avoir complété une session
   */
  async unlockFeed(sessionCompletionId: number, message?: string, emoji?: string): Promise<{
    unlocked: boolean;
    streak: number;
    feedEventId: number;
  }> {
    const response = await api.post<{
      success: boolean;
      unlocked: boolean;
      streak: number;
      feedEventId: number;
    }>('/social/feed/unlock', {
      sessionCompletionId,
      message,
      emoji
    });
    
    return {
      unlocked: response.data.unlocked,
      streak: response.data.streak,
      feedEventId: response.data.feedEventId
    };
  },

  /**
   * Vérifier si le feed est déverrouillé aujourd'hui
   */
  async checkFeedStatus(): Promise<{unlocked: boolean; unlockedAt?: string}> {
    const response = await api.get<{
      success: boolean;
      unlocked: boolean;
      unlockedAt?: string;
    }>('/social/feed/status');
    
    return {
      unlocked: response.data.unlocked,
      unlockedAt: response.data.unlockedAt
    };
  },

  /**
   * Récupérer les statistiques du cercle
   */
  async getCircleStats(): Promise<{
    totalFriends: number;
    activeFriends: number;
    totalSessions: number;
    combinedStreak: number;
  }> {
    const response = await api.get<{
      success: boolean;
      stats: {
        totalFriends: number;
        activeFriends: number;
        totalSessions: number;
        combinedStreak: number;
      };
    }>('/social/circle');
    
    return response.data.stats;
  },

  // ============ PROFIL PUBLIC ============

  /**
   * Récupérer le profil public d'un utilisateur
   */
  async getPublicProfile(userId: number): Promise<PublicProfile> {
    const response = await api.get<{success: boolean; data: PublicProfile}>(
      `/social/profile/${userId}`
    );
    return response.data.data;
  },

  /**
   * Obtenir les données pour générer une carte de partage
   */
  async getShareCardData(sessionCompletionId?: number): Promise<any> {
    const url = sessionCompletionId 
      ? `/social/share/card?sessionCompletionId=${sessionCompletionId}`
      : '/social/share/card';
    
    const response = await api.get(url);
    return response.data;
  },
};
