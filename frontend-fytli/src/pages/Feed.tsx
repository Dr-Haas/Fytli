/**
 * Page Feed - Affiche le Cercle Fytli et le feed social des amis
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CercleFytli from '../components/CercleFytli';
import FeedCards from '../components/FeedCards';
import { getFeed, checkFeedStatus, FeedEvent } from '../services/socialService';

const Feed: React.FC = () => {
  const navigate = useNavigate();
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [feedStatus, setFeedStatus] = useState<any>(null);

  useEffect(() => {
    loadFeedData();
  }, []);

  const loadFeedData = async () => {
    try {
      setLoading(true);

      // Vérifier le statut du feed
      const status = await checkFeedStatus();
      setFeedStatus(status);
      setIsLocked(!status.unlocked);

      // Charger le feed si déverrouillé
      if (status.unlocked) {
        const feedData = await getFeed();
        setFeedEvents(feedData.feed);
        setIsLocked(feedData.locked);
      }
    } catch (error) {
      console.error('Erreur chargement feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadFeedData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cercle Fytli</h1>
              <p className="text-sm text-gray-600">Votre communauté fitness</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/share')}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
              >
                📤 Partager
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
              >
                👤 Profil
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Colonne gauche : Cercle Fytli */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-6 lg:sticky lg:top-8"
              >
                <CercleFytli onFriendClick={(friendId) => console.log('Clic ami:', friendId)} />

                {/* Actions rapides */}
                <div className="mt-6 space-y-2">
                  {isLocked && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl text-center"
                    >
                      <p className="text-sm font-medium text-gray-800 mb-3">
                        🔒 Bouge pour rallumer ton cercle
                      </p>
                      <button
                        onClick={() => navigate('/programs')}
                        className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm font-medium"
                      >
                        🏃 Faire une séance
                      </button>
                    </motion.div>
                  )}

                  <button
                    onClick={() => navigate('/friends')}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                  >
                    <span>👥</span>
                    <span>Gérer mes amis</span>
                  </button>
                </div>

                {/* Stats du jour */}
                {feedStatus && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-2">
                      Vos statistiques
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <div className="text-xl font-bold text-orange-600">
                          {feedStatus.streak}
                        </div>
                        <div className="text-xs text-gray-600">Série</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-indigo-600">
                          {feedStatus.total_days}
                        </div>
                        <div className="text-xs text-gray-600">Total</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-600">
                          {feedStatus.unlocked ? '✅' : '🔒'}
                        </div>
                        <div className="text-xs text-gray-600">Statut</div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Colonne droite : Feed des amis */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {isLocked ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <div className="text-6xl mb-4 grayscale blur-sm">📱</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Feed verrouillé
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Complète une séance pour déverrouiller le feed de tes amis
                  </p>
                  <button
                    onClick={() => navigate('/programs')}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md font-semibold"
                  >
                    🏃 Commencer une séance
                  </button>
                </div>
              ) : (
                <FeedCards
                  feedEvents={feedEvents}
                  loading={loading}
                  onRefresh={handleRefresh}
                />
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Message motivant en bas */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white text-center shadow-xl"
        >
          <p className="text-lg font-semibold mb-2">
            💡 L'effet collectif
          </p>
          <p className="text-sm opacity-90">
            En bougeant, tu inspires tes amis. Ensemble, vous créez une énergie positive !
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Feed;

