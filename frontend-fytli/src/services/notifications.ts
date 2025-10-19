import api from './api';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

const notificationsService = {
  /**
   * Récupérer les notifications de l'utilisateur
   */
  async getNotifications(limit: number = 20): Promise<Notification[]> {
    try {
      const response = await api.get(`/push/notifications?limit=${limit}`);
      
      // Convertir les timestamps en objets Date
      return response.data.map((notif: any) => ({
        ...notif,
        timestamp: new Date(notif.timestamp)
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      return [];
    }
  },

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await api.post(`/push/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
      throw error;
    }
  },

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead(): Promise<void> {
    try {
      await api.post('/push/notifications/read-all');
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
      throw error;
    }
  },

  /**
   * Récupérer les statistiques des notifications
   */
  async getStats(): Promise<any> {
    try {
      const response = await api.get('/push/stats');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return null;
    }
  }
};

export default notificationsService;

