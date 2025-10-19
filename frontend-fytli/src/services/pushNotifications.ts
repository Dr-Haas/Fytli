import api from './api';

export interface NotificationPreferences {
  preference_id?: number;
  user_id?: number;
  training_reminders: boolean;
  session_completed_by_members: boolean;
  badge_unlocked: boolean;
  weekly_goals: boolean;
  new_programs: boolean;
  daily_motivation: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  reminder_minutes_before: number;
}

export interface PushSubscription {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

class PushNotificationService {
  private vapidPublicKey: string | null = null;

  /**
   * Vérifier si les notifications push sont supportées
   */
  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  /**
   * Vérifier l'état de la permission
   */
  getPermissionState(): NotificationPermission {
    if (!this.isSupported()) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * Récupérer la clé publique VAPID depuis le serveur
   */
  async getVapidPublicKey(): Promise<string> {
    if (this.vapidPublicKey) {
      return this.vapidPublicKey;
    }

    try {
      const response = await api.get('/push/vapid-public-key');
      this.vapidPublicKey = response.data.publicKey;
      return this.vapidPublicKey;
    } catch (error) {
      console.error('Erreur lors de la récupération de la clé VAPID:', error);
      throw error;
    }
  }

  /**
   * Convertir une clé VAPID base64 en Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Demander la permission de notifications
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Les notifications push ne sont pas supportées sur cet appareil');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  /**
   * S'abonner aux notifications push
   */
  async subscribe(): Promise<void> {
    try {
      // Vérifier le support
      if (!this.isSupported()) {
        throw new Error('Les notifications push ne sont pas supportées');
      }

      // Demander la permission
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permission de notifications refusée');
      }

      // Enregistrer le Service Worker
      const registration = await navigator.serviceWorker.ready;

      // Récupérer la clé VAPID
      const vapidPublicKey = await this.getVapidPublicKey();
      const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);

      // S'abonner aux notifications push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      // Envoyer l'abonnement au serveur
      await api.post('/push/subscribe', {
        subscription: subscription.toJSON(),
      });

      console.log('✅ Abonnement aux notifications réussi');
    } catch (error) {
      console.error('Erreur lors de l\'abonnement aux notifications:', error);
      throw error;
    }
  }

  /**
   * Se désabonner des notifications push
   */
  async unsubscribe(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Se désabonner localement
        await subscription.unsubscribe();

        // Informer le serveur
        await api.post('/push/unsubscribe', {
          endpoint: subscription.endpoint,
        });

        console.log('✅ Désabonnement des notifications réussi');
      }
    } catch (error) {
      console.error('Erreur lors du désabonnement:', error);
      throw error;
    }
  }

  /**
   * Vérifier si l'utilisateur est abonné
   */
  async isSubscribed(): Promise<boolean> {
    try {
      if (!this.isSupported()) {
        return false;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      return subscription !== null;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'abonnement:', error);
      return false;
    }
  }

  /**
   * Récupérer les préférences de notification
   */
  async getPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await api.get('/push/preferences');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour les préférences de notification
   */
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    try {
      await api.put('/push/preferences', preferences);
      console.log('✅ Préférences mises à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error);
      throw error;
    }
  }

  /**
   * Envoyer une notification de test
   */
  async sendTestNotification(): Promise<void> {
    try {
      await api.post('/push/test');
      console.log('✅ Notification de test envoyée');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification de test:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques des notifications
   */
  async getStats(): Promise<any> {
    try {
      const response = await api.get('/push/stats');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  /**
   * Afficher une notification locale (pour les tests)
   */
  async showLocalNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Les notifications ne sont pas supportées');
    }

    if (Notification.permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options,
      });
    }
  }
}

export const pushNotificationService = new PushNotificationService();
export default pushNotificationService;

