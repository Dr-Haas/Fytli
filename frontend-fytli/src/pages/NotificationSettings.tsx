import { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Moon, TestTube, TrendingUp } from 'lucide-react';
import pushNotificationService, { NotificationPreferences } from '../services/pushNotifications';

export default function NotificationSettings() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    checkNotificationStatus();
    loadPreferences();
    loadStats();
  }, []);

  const checkNotificationStatus = async () => {
    const supported = pushNotificationService.isSupported();
    setIsSupported(supported);

    if (supported) {
      const perm = pushNotificationService.getPermissionState();
      setPermission(perm);

      const subscribed = await pushNotificationService.isSubscribed();
      setIsSubscribed(subscribed);
    }
  };

  const loadPreferences = async () => {
    try {
      const prefs = await pushNotificationService.getPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statistics = await pushNotificationService.getStats();
      setStats(statistics);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      await pushNotificationService.subscribe();
      await checkNotificationStatus();
      alert('✅ Notifications activées avec succès !');
    } catch (error: any) {
      console.error('Erreur lors de l\'activation:', error);
      alert(`❌ Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!confirm('Êtes-vous sûr de vouloir désactiver les notifications ?')) {
      return;
    }

    try {
      setLoading(true);
      await pushNotificationService.unsubscribe();
      await checkNotificationStatus();
      alert('✅ Notifications désactivées');
    } catch (error: any) {
      console.error('Erreur lors de la désactivation:', error);
      alert(`❌ Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = async (key: keyof NotificationPreferences, value: any) => {
    if (!preferences) return;

    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);

    try {
      setSaving(true);
      await pushNotificationService.updatePreferences({ [key]: value });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      // Restaurer l'ancienne valeur en cas d'erreur
      loadPreferences();
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      await pushNotificationService.sendTestNotification();
      alert('✅ Notification de test envoyée ! Vous devriez la recevoir dans quelques secondes.');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du test:', error);
      alert('❌ Erreur lors de l\'envoi de la notification de test');
    }
  };

  if (!isSupported) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <BellOff className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Notifications non supportées
          </h2>
          <p className="text-gray-600">
            Votre navigateur ne supporte pas les notifications push. 
            Essayez avec Chrome, Firefox, Safari ou Edge.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Bell className="w-8 h-8 text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications Push</h1>
              <p className="text-gray-600">Gérez vos préférences de notifications</p>
            </div>
          </div>

          {isSubscribed ? (
            <button
              onClick={handleUnsubscribe}
              disabled={loading}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              Désactiver
            </button>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              Activer les notifications
            </button>
          )}
        </div>

        {/* Statut */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Statut</p>
              <p className={`font-bold ${isSubscribed ? 'text-green-600' : 'text-gray-400'}`}>
                {isSubscribed ? '✓ Activées' : '✗ Désactivées'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Permission</p>
              <p className="font-bold text-gray-900 capitalize">{permission}</p>
            </div>
            {stats && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Cette semaine</p>
                  <p className="font-bold text-orange-600">{stats.sent_last_week || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Appareils</p>
                  <p className="font-bold text-gray-900">{stats.active_devices || 0}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Préférences */}
      {isSubscribed && preferences && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Types de notifications</h2>

          {/* Rappels d'entraînement */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-orange-500" />
              <div>
                <p className="font-semibold text-gray-900">Rappels d'entraînement</p>
                <p className="text-sm text-gray-600">Notifications avant vos créneaux d'entraînement</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.training_reminders}
                onChange={(e) => handlePreferenceChange('training_reminders', e.target.checked)}
                disabled={saving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          {/* Sessions complétées par les membres */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-semibold text-gray-900">Sessions des membres</p>
                <p className="text-sm text-gray-600">Quand un membre complète une session</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.session_completed_by_members}
                onChange={(e) => handlePreferenceChange('session_completed_by_members', e.target.checked)}
                disabled={saving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          {/* Badges débloqués */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-semibold text-gray-900">Badges débloqués</p>
                <p className="text-sm text-gray-600">Quand vous obtenez un nouveau badge</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.badge_unlocked}
                onChange={(e) => handlePreferenceChange('badge_unlocked', e.target.checked)}
                disabled={saving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          {/* Objectifs hebdomadaires */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-semibold text-gray-900">Objectifs hebdomadaires</p>
                <p className="text-sm text-gray-600">Quand vous atteignez vos objectifs</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.weekly_goals}
                onChange={(e) => handlePreferenceChange('weekly_goals', e.target.checked)}
                disabled={saving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          {/* Motivation quotidienne */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💪</span>
              <div>
                <p className="font-semibold text-gray-900">Motivation quotidienne</p>
                <p className="text-sm text-gray-600">Message de motivation chaque jour</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.daily_motivation}
                onChange={(e) => handlePreferenceChange('daily_motivation', e.target.checked)}
                disabled={saving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          {/* Nouveaux programmes */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">✨</span>
              <div>
                <p className="font-semibold text-gray-900">Nouveaux programmes</p>
                <p className="text-sm text-gray-600">Quand de nouveaux programmes sont disponibles</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.new_programs}
                onChange={(e) => handlePreferenceChange('new_programs', e.target.checked)}
                disabled={saving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          {/* Paramètres avancés */}
          <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span>Paramètres avancés</span>
            </h3>

            {/* Heures de silence */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <Moon className="w-4 h-4" />
                  <span>Début heures silencieuses</span>
                </label>
                <input
                  type="time"
                  value={preferences.quiet_hours_start}
                  onChange={(e) => handlePreferenceChange('quiet_hours_start', e.target.value)}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <Moon className="w-4 h-4" />
                  <span>Fin heures silencieuses</span>
                </label>
                <input
                  type="time"
                  value={preferences.quiet_hours_end}
                  onChange={(e) => handlePreferenceChange('quiet_hours_end', e.target.value)}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Rappel minutes avant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rappel avant le créneau (minutes)
              </label>
              <select
                value={preferences.reminder_minutes_before}
                onChange={(e) => handlePreferenceChange('reminder_minutes_before', parseInt(e.target.value))}
                disabled={saving}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="15">15 minutes avant</option>
                <option value="30">30 minutes avant</option>
                <option value="60">1 heure avant</option>
                <option value="120">2 heures avant</option>
              </select>
            </div>
          </div>

          {/* Bouton de test */}
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={handleTestNotification}
              className="w-full md:w-auto px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center justify-center space-x-2"
            >
              <TestTube className="w-5 h-5" />
              <span>Envoyer une notification de test</span>
            </button>
          </div>
        </div>
      )}

      {saving && (
        <div className="fixed bottom-4 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg">
          Enregistrement...
        </div>
      )}
    </div>
  );
}

