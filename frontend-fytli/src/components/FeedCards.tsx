/**
 * Composant FeedCards - Affiche les cartes du feed social
 * Montre les activités des amis (séances complétées, streaks, etc.)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FeedEvent } from '../services/socialService';

interface FeedCardsProps {
  feedEvents: FeedEvent[];
  loading?: boolean;
  onRefresh?: () => void;
}

const FeedCards: React.FC<FeedCardsProps> = ({ feedEvents, loading = false, onRefresh }) => {
  // Formater la date relative
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  // Obtenir la couleur selon le type d'événement
  const getEventColor = (type: string) => {
    switch (type) {
      case 'session_completed':
        return 'from-indigo-500 to-purple-600';
      case 'streak_achieved':
        return 'from-orange-500 to-red-500';
      case 'program_started':
        return 'from-green-500 to-emerald-600';
      case 'goal_reached':
        return 'from-yellow-500 to-orange-500';
      case 'badge_earned':
        return 'from-pink-500 to-rose-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Obtenir l'icône selon le type
  const getEventIcon = (type: string, emoji?: string) => {
    if (emoji) return emoji;
    
    switch (type) {
      case 'session_completed':
        return '💪';
      case 'streak_achieved':
        return '🔥';
      case 'program_started':
        return '🎯';
      case 'goal_reached':
        return '🏆';
      case 'badge_earned':
        return '🏅';
      default:
        return '✨';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!feedEvents || feedEvents.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <div className="text-6xl mb-4">🤝</div>
        <p className="text-gray-600 mb-2">Aucune activité récente</p>
        <p className="text-sm text-gray-500">
          Ajoutez des amis pour voir leur activité ici
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* En-tête avec refresh */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Activité de vos amis
        </h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            aria-label="Rafraîchir"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Cartes du feed */}
      {feedEvents.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md overflow-hidden">
                    {event.avatar_url ? (
                      <img
                        src={event.avatar_url}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{event.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  
                  {/* Badge d'icône d'événement */}
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${getEventColor(event.type)} flex items-center justify-center text-xs shadow-md`}>
                    {getEventIcon(event.type, event.emoji)}
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    {event.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(event.created_at)}
                  </span>
                </div>

                <p className="text-gray-700 mb-2">
                  {event.message}
                </p>

                {/* Stats de la séance (si disponibles) */}
                {(event.duration || event.average_heart_rate || event.calories_burned) && (
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                    {event.duration && (
                      <div className="flex items-center gap-1">
                        <span>⏱️</span>
                        <span>{Math.round(event.duration)} min</span>
                      </div>
                    )}
                    {event.average_heart_rate && (
                      <div className="flex items-center gap-1">
                        <span>❤️</span>
                        <span>{event.average_heart_rate} bpm</span>
                      </div>
                    )}
                    {event.calories_burned && (
                      <div className="flex items-center gap-1">
                        <span>🔥</span>
                        <span>{event.calories_burned} kcal</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Barre de couleur en bas selon le type */}
          <div className={`h-1 bg-gradient-to-r ${getEventColor(event.type)}`}></div>
        </motion.div>
      ))}

      {/* Message de fin */}
      {feedEvents.length >= 10 && (
        <div className="text-center py-4 text-sm text-gray-500">
          Vous êtes à jour ! 🎉
        </div>
      )}
    </div>
  );
};

export default FeedCards;

