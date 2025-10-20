/**
 * Page PublicProfile - Profil public d'un utilisateur (/u/:username)
 * Version minimaliste visible après partage
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPublicProfile, PublicProfile as PublicProfileType, addFriend } from '../services/socialService';

const PublicProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PublicProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    if (username) {
      loadProfile();
    }
  }, [username]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!username) {
        throw new Error('Username manquant');
      }

      const { profile: profileData } = await getPublicProfile(username);
      setProfile(profileData);
    } catch (err: any) {
      console.error('Erreur chargement profil:', err);
      if (err.message?.includes('introuvable')) {
        setError('Utilisateur introuvable');
      } else if (err.message?.includes('privé')) {
        setError('Ce profil est privé');
      } else {
        setError('Erreur lors du chargement du profil');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    if (!profile) return;

    try {
      setSendingRequest(true);
      await addFriend(profile.id);
      setRequestSent(true);
    } catch (err: any) {
      console.error('Erreur ajout ami:', err);
      alert(err.message || 'Erreur lors de l\'envoi de la demande');
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error || 'Profil introuvable'}
          </h2>
          <p className="text-gray-600 mb-6">
            L'utilisateur @{username} n'existe pas ou son profil est privé.
          </p>
          <button
            onClick={() => navigate('/feed')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md font-semibold"
          >
            Retour au cercle
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/feed')}
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
              <h1 className="text-xl font-bold text-gray-900">Profil public</h1>
              <p className="text-sm text-gray-600">@{username}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>

          {/* Profil */}
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="relative -mt-16 mb-4">
              <div className="w-32 h-32 rounded-full bg-white p-2 shadow-xl mx-auto">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{profile.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Nom et username */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {profile.name}
              </h2>
              <p className="text-gray-600">@{profile.username}</p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-indigo-50 rounded-xl">
                <div className="text-3xl font-bold text-indigo-600 mb-1">
                  {profile.total_sessions}
                </div>
                <div className="text-sm text-gray-600">Séances</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {profile.friends_count}
                </div>
                <div className="text-sm text-gray-600">Amis</div>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-xl">
                <div className="text-3xl font-bold text-pink-600 mb-1">
                  {profile.badges_count}
                </div>
                <div className="text-sm text-gray-600">Badges</div>
              </div>
            </div>

            {/* Badges récents */}
            {profile.recent_badges && profile.recent_badges.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  🏅 Badges récents
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {profile.recent_badges.map((badge: any) => (
                    <div
                      key={badge.id}
                      className="bg-gray-50 rounded-xl p-3 text-center hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-3xl mb-1">{badge.icon}</div>
                      <p className="text-xs font-medium text-gray-700 line-clamp-2">
                        {badge.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action : Ajouter comme ami */}
            <div className="border-t border-gray-100 pt-6">
              {requestSent ? (
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="font-semibold text-green-800 mb-1">
                    Demande envoyée !
                  </p>
                  <p className="text-sm text-green-700">
                    Vous recevrez une notification quand {profile.name} acceptera votre demande.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleAddFriend}
                  disabled={sendingRequest}
                  className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingRequest ? (
                    <span>Envoi en cours...</span>
                  ) : (
                    <span>👥 Ajouter à mon cercle</span>
                  )}
                </button>
              )}
            </div>

            {/* Info membre depuis */}
            <div className="mt-4 text-center text-sm text-gray-500">
              Membre depuis {new Date(profile.created_at).toLocaleDateString('fr-FR', {
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>
        </motion.div>

        {/* CTA rejoindre Fytli */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-2">Rejoignez le cercle Fytli</h3>
          <p className="text-lg mb-6 opacity-90">
            Créez votre profil et connectez-vous avec vos amis pour vous motiver ensemble
          </p>
          <button
            onClick={() => navigate('/auth/signup')}
            className="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-100 transition-all shadow-md font-bold text-lg"
          >
            🚀 Créer mon compte
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicProfile;

