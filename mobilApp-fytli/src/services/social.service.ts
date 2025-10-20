import api from './api';
import { UserFollow, SocialFeedItem, User } from '@/types/database';

interface FollowResponse {
  success: boolean;
  data: UserFollow;
}

interface FollowersResponse {
  success: boolean;
  data: User[];
}

interface FeedResponse {
  success: boolean;
  data: SocialFeedItem[];
}

export const socialService = {
  async follow(userId: number): Promise<UserFollow> {
    const response = await api.post<FollowResponse>('/social/follow', { following_id: userId });
    return response.data.data;
  },

  async unfollow(userId: number): Promise<void> {
    await api.delete(`/social/unfollow/${userId}`);
  },

  async getFollowers(userId?: number): Promise<User[]> {
    const url = userId ? `/social/followers/${userId}` : '/social/followers';
    const response = await api.get<FollowersResponse>(url);
    return response.data.data;
  },

  async getFollowing(userId?: number): Promise<User[]> {
    const url = userId ? `/social/following/${userId}` : '/social/following';
    const response = await api.get<FollowersResponse>(url);
    return response.data.data;
  },

  async isFollowing(userId: number): Promise<boolean> {
    const response = await api.get<{success: boolean; isFollowing: boolean}>(`/social/is-following/${userId}`);
    return response.data.isFollowing;
  },

  async getFeed(): Promise<SocialFeedItem[]> {
    const response = await api.get<FeedResponse>('/social/feed');
    return response.data.data;
  },

  async getPublicProfile(userId: number): Promise<User> {
    const response = await api.get<{success: boolean; data: User}>(`/social/profile/${userId}`);
    return response.data.data;
  },
};

