import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import notificationsService, { Notification as NotificationData } from '../services/notifications';

interface Notification extends NotificationData {
  icon?: string;
}

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Charger les vraies notifications depuis l'API
  useEffect(() => {
    loadNotifications();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsService.getNotifications(20);
      
      // Ajouter les icônes selon le type
      const notificationsWithIcons = data.map(notif => ({
        ...notif,
        icon: getIconForType(notif.type)
      }));
      
      setNotifications(notificationsWithIcons);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type: string): string => {
    switch (type) {
      case 'session_completed':
        return '💪';
      case 'badge_unlocked':
        return '🏆';
      case 'weekly_goal':
        return '🎯';
      case 'training_reminder':
        return '⏰';
      case 'daily_motivation':
        return '✨';
      case 'new_program':
        return '🚀';
      default:
        return '🔔';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = async (notification: Notification) => {
    // Marquer comme lu dans l'UI immédiatement
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, read: true } : n))
    );

    // Marquer comme lu dans le backend
    try {
      await notificationsService.markAsRead(notification.id);
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }

    // Navigation selon le type
    if (notification.type === 'badge_unlocked') {
      navigate('/profile');
    } else if (notification.type === 'session_completed') {
      // Navigation vers le programme ou la session si on a les données
      if (notification.data?.programId) {
        navigate(`/programs/${notification.data.programId}`);
      }
    } else if (notification.type === 'training_reminder') {
      // Navigation vers les programmes
      navigate('/programs');
    }

    setIsOpen(false);
  };

  const markAllAsRead = async () => {
    // Marquer dans l'UI immédiatement
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    
    // Marquer dans le backend
    try {
      await notificationsService.markAllAsRead();
    } catch (error) {
      console.error('Erreur lors du marquage des notifications:', error);
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  return (
    <div className="relative">
      {/* Bouton Cloche */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-fytli-red text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panneau de notifications */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu déroulant */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* En-tête */}
              <div className="p-4 border-b bg-gradient-to-r from-fytli-red/5 to-fytli-orange/5 flex items-center justify-between">
                <h3 className="font-bold text-lg text-gray-900">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 text-sm text-fytli-orange">
                      ({unreadCount} {unreadCount === 1 ? 'nouvelle' : 'nouvelles'})
                    </span>
                  )}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-fytli-orange hover:text-fytli-red transition-colors font-medium"
                  >
                    Tout marquer lu
                  </button>
                )}
              </div>

              {/* Liste des notifications */}
              <div className="overflow-y-auto flex-1">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="animate-spin h-8 w-8 border-4 border-fytli-orange border-t-transparent rounded-full mx-auto mb-3" />
                    <p className="text-sm">Chargement...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Aucune notification</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-fytli-orange/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{notification.icon || '🔔'}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-sm text-gray-900">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="h-2 w-2 bg-fytli-orange rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t bg-gray-50">
                  <button
                    onClick={() => {
                      navigate('/notifications/settings');
                      setIsOpen(false);
                    }}
                    className="text-sm text-fytli-orange hover:text-fytli-red transition-colors font-medium"
                  >
                    Gérer les notifications →
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

