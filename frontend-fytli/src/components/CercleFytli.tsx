/**
 * Composant CercleFytli - Affiche le cercle social animé
 * avec l'utilisateur au centre et ses amis autour
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCircleStats, CircleStats } from '../services/socialService';

interface CercleFytliProps {
  className?: string;
  onFriendClick?: (friendId: number) => void;
}

const CercleFytli: React.FC<CercleFytliProps> = ({ className = '', onFriendClick }) => {
  const [circleData, setCircleData] = useState<CircleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données du cercle
  useEffect(() => {
    loadCircleData();
  }, []);

  const loadCircleData = async () => {
    try {
      setLoading(true);
      const data = await getCircleStats();
      setCircleData(data);
      setError(null);
    } catch (err: any) {
      console.error('Erreur chargement cercle:', err);
      setError('Impossible de charger le cercle');
    } finally {
      setLoading(false);
    }
  };

  // Calculer les positions des amis autour du cercle
  const calculatePosition = (index: number, total: number, radius: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Commence en haut
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !circleData) {
    return (
      <div className={`text-center text-gray-500 ${className}`}>
        <p>{error || 'Aucune donnée disponible'}</p>
        <button
          onClick={loadCircleData}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const { user_status, circle } = circleData;
  const isUnlocked = user_status.unlocked;
  const hasStreak = user_status.streak >= 3;
  const radius = circle.total_friends > 8 ? 140 : 120;

  return (
    <div className={`relative ${className}`}>
      {/* Conteneur du cercle */}
      <div className="relative w-full aspect-square max-w-md mx-auto">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="-200 -200 400 400"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cercle de fond */}
          <circle
            cx="0"
            cy="0"
            r={radius + 20}
            fill="none"
            stroke={isUnlocked ? '#818cf8' : '#9ca3af'}
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.3"
          />

          {/* Lignes de connexion vers les amis */}
          {isUnlocked && circle.friends.map((friend, index) => {
            const { x, y } = calculatePosition(index, circle.total_friends, radius);
            return (
              <motion.line
                key={friend.id}
                x1="0"
                y1="0"
                x2={x}
                y2={y}
                stroke={friend.feed_unlocked_today ? '#34d399' : '#818cf8'}
                strokeWidth="2"
                opacity={friend.feed_unlocked_today ? 0.6 : 0.3}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: friend.feed_unlocked_today ? 0.6 : 0.3 
                }}
                transition={{ 
                  duration: 1, 
                  delay: index * 0.1,
                  ease: 'easeOut'
                }}
              />
            );
          })}
        </svg>

        {/* Avatar central (utilisateur) */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className={`relative ${hasStreak ? 'animate-pulse' : ''}`}>
            {/* Halo pour streak */}
            {hasStreak && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-50 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ width: '120%', height: '120%', left: '-10%', top: '-10%' }}
              />
            )}

            {/* Cercle de statut */}
            <div
              className={`relative rounded-full p-1 ${
                isUnlocked
                  ? hasStreak
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                  : 'bg-gray-400'
              }`}
            >
              <div className="bg-white rounded-full p-1">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {isUnlocked ? '✨' : '🔒'}
                </div>
              </div>
            </div>

            {/* Badge de streak */}
            {user_status.streak > 0 && (
              <motion.div
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                🔥 {user_status.streak}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Avatars des amis */}
        <AnimatePresence>
          {circle.friends.map((friend, index) => {
            const { x, y } = calculatePosition(index, circle.total_friends, radius);

            return (
              <motion.div
                key={friend.id}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  x,
                  y,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: isUnlocked ? 1 : 0.4 
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  delay: index * 0.05, 
                  type: 'spring', 
                  stiffness: 260, 
                  damping: 20 
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onFriendClick?.(friend.id)}
              >
                <div className="relative">
                  {/* Avatar de l'ami */}
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-white font-semibold shadow-lg overflow-hidden ${
                      friend.feed_unlocked_today
                        ? 'border-green-400 bg-gradient-to-br from-green-400 to-emerald-500'
                        : isUnlocked
                        ? 'border-indigo-400 bg-gradient-to-br from-indigo-400 to-purple-400'
                        : 'border-gray-400 bg-gray-400'
                    }`}
                  >
                    {friend.avatar_url ? (
                      <img
                        src={friend.avatar_url}
                        alt={friend.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm">
                        {friend.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Indicateur actif */}
                  {friend.feed_unlocked_today && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Légende */}
      <div className="mt-6 text-center">
        {!isUnlocked ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-600"
          >
            <p className="text-lg font-semibold">🔒 Cercle verrouillé</p>
            <p className="text-sm mt-1">Bouge pour rallumer ton cercle</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-indigo-600"
          >
            <p className="text-lg font-semibold">✨ Cercle actif</p>
            <p className="text-sm mt-1">
              {circle.active_today} / {circle.total_friends} ami{circle.total_friends > 1 ? 's' : ''} actif{circle.active_today > 1 ? 's' : ''} aujourd'hui
            </p>
          </motion.div>
        )}

        {/* Stats */}
        <div className="flex justify-center gap-4 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span>🔥</span>
            <span>{user_status.streak} jour{user_status.streak > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span>{user_status.total_days} total</span>
          </div>
          <div className="flex items-center gap-1">
            <span>👥</span>
            <span>{circle.total_friends} ami{circle.total_friends > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CercleFytli;

