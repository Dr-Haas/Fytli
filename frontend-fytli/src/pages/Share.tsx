/**
 * Page Share - Génération et prévisualisation de carte partageable
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ShareCard from '../components/ShareCard';
import { getShareCardData, ShareCardData } from '../services/socialService';

const Share: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [cardData, setCardData] = useState<ShareCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCardData();
  }, []);

  const loadCardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer l'ID de session si fourni
      const sessionId = searchParams.get('sessionId');
      const sessionCompletionId = sessionId ? parseInt(sessionId) : undefined;

      const data = await getShareCardData(sessionCompletionId);
      setCardData(data);
    } catch (err: any) {
      console.error('Erreur chargement données:', err);
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (imageUrl: string) => {
    console.log('Image partagée:', imageUrl);
    // Vous pouvez ajouter une analytics ici
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Retour"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Carte du jour</h1>
                <p className="text-sm text-gray-600">Partagez votre progression</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/feed')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              🤝 Cercle
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement de vos données...</p>
            </div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Erreur</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={loadCardData}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
              >
                Réessayer
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                Retour
              </button>
            </div>
          </motion.div>
        ) : cardData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Colonne gauche : Carte */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <ShareCard data={cardData} onShare={handleShare} />
            </motion.div>

            {/* Colonne droite : Informations et conseils */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Statistiques */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  📊 Vos statistiques
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔥</span>
                      <span className="text-gray-700 font-medium">Série actuelle</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">
                      {cardData.stats.streak}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📅</span>
                      <span className="text-gray-700 font-medium">Jours totaux</span>
                    </div>
                    <span className="text-2xl font-bold text-indigo-600">
                      {cardData.stats.total_days}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👥</span>
                      <span className="text-gray-700 font-medium">Amis</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">
                      {cardData.stats.friends_count}
                    </span>
                  </div>
                </div>
              </div>

              {/* Conseils de partage */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-4">💡 Conseils de partage</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">✓</span>
                    <span>Partagez votre carte en story Instagram ou Threads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">✓</span>
                    <span>Tagguez @fytli pour être mis en avant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">✓</span>
                    <span>Invitez vos amis à rejoindre votre cercle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">✓</span>
                    <span>Plus vous partagez, plus vous motivez les autres !</span>
                  </li>
                </ul>
              </div>

              {/* Message motivant */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">🌟</div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    Vous inspirez votre communauté !
                  </h4>
                  <p className="text-sm text-gray-600">
                    Chaque partage motive vos amis et renforce le cercle Fytli.
                    Continuez comme ça !
                  </p>
                </div>
              </div>

              {/* Lien vers le profil public */}
              {cardData.user.username && (
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">Votre profil public :</p>
                  <button
                    onClick={() => navigate(`/u/${cardData.user.username}`)}
                    className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                  >
                    fytli.fr/u/{cardData.user.username}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        ) : null}
      </div>

      {/* CTA en bas */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-lg p-6 text-center"
        >
          <p className="text-gray-700 mb-4">
            Vous n'avez pas encore fait votre séance du jour ?
          </p>
          <button
            onClick={() => navigate('/programs')}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md font-semibold"
          >
            🏃 Commencer une séance
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Share;

