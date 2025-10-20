/**
 * Composant ShareCard - Génère une carte visuelle partageable
 * Pour partager sur les réseaux sociaux (Instagram, Threads, etc.)
 */

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { ShareCardData } from '../services/socialService';

interface ShareCardProps {
  data: ShareCardData;
  onShare?: (imageUrl: string) => void;
}

const ShareCard: React.FC<ShareCardProps> = ({ data, onShare }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Générer l'image de la carte
  const generateImage = async (): Promise<string | undefined> => {
    if (!cardRef.current) return undefined;

    try {
      setIsGenerating(true);
      
      // Attendre un peu pour que les animations se stabilisent
      await new Promise(resolve => setTimeout(resolve, 500));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        width: 1080,
        height: 1920,
        pixelRatio: 2,
      });

      setGeneratedImage(dataUrl);
      return dataUrl;
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      alert('Erreur lors de la génération de l\'image');
      return undefined;
    } finally {
      setIsGenerating(false);
    }
  };

  // Partager l'image
  const handleShare = async () => {
    let imageUrl: string | null | undefined = generatedImage;

    if (!imageUrl) {
      imageUrl = await generateImage();
      if (!imageUrl) return;
    }

    // Utiliser l'API Web Share si disponible
    if (navigator.share) {
      try {
        // Convertir data URL en blob
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'fytli-share.png', { type: 'image/png' });

        await navigator.share({
          title: 'Mon activité Fytli',
          text: `${data.user.name} - ${data.stats.streak} jours de suite 🔥`,
          files: [file],
        });
      } catch (error) {
        console.error('Erreur lors du partage:', error);
        // Fallback : télécharger l'image
        downloadImage(imageUrl);
      }
    } else {
      // Fallback : télécharger l'image
      downloadImage(imageUrl);
    }

    if (onShare) {
      onShare(imageUrl);
    }
  };

  // Télécharger l'image
  const downloadImage = (dataUrl: string) => {
    const link = document.createElement('a');
    link.download = `fytli-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Choisir un fond dégradé selon le streak
  const getBackgroundGradient = () => {
    const streak = data.stats.streak;
    if (streak >= 7) {
      return 'from-orange-500 via-red-500 to-pink-600';
    } else if (streak >= 3) {
      return 'from-purple-500 via-indigo-600 to-blue-600';
    } else if (data.status.unlocked) {
      return 'from-green-500 via-emerald-600 to-teal-600';
    } else {
      return 'from-gray-500 via-gray-600 to-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Prévisualisation de la carte */}
      <div className="relative">
        <div
          ref={cardRef}
          className="relative w-full aspect-[9/16] max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl"
          style={{ width: '360px', height: '640px' }}
        >
          {/* Fond dégradé */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getBackgroundGradient()}`}>
            {/* Pattern de points */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
          </div>

          {/* Contenu de la carte */}
          <div className="relative z-10 h-full flex flex-col items-center justify-between p-8 text-white">
            {/* En-tête */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-white/20 backdrop-blur-sm p-1 mb-4 shadow-xl">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {data.user.avatar_url ? (
                      <img
                        src={data.user.avatar_url}
                        alt={data.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-gray-800">
                        {data.user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>

              <h2 className="text-2xl font-bold mb-2">{data.user.name}</h2>
              {data.user.username && (
                <p className="text-sm opacity-90">@{data.user.username}</p>
              )}
            </div>

            {/* Message principal */}
            <div className="text-center flex-1 flex flex-col items-center justify-center">
              {data.stats.streak > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="text-7xl">🔥</div>
                  <div>
                    <div className="text-6xl font-black mb-2">{data.stats.streak}</div>
                    <p className="text-xl font-medium">
                      jour{data.stats.streak > 1 ? 's' : ''} de suite
                    </p>
                  </div>
                  {data.feed_event && (
                    <p className="text-lg opacity-90 mt-4">
                      {data.feed_event.emoji} {data.feed_event.message}
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="text-7xl">✨</div>
                  <p className="text-2xl font-bold">
                    {data.status.unlocked 
                      ? "Séance du jour terminée !"
                      : "En route vers mes objectifs"}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Stats en bas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full"
            >
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 shadow-xl">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{data.stats.streak}</div>
                    <div className="text-xs opacity-80">Série</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{data.stats.total_days}</div>
                    <div className="text-xs opacity-80">Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{data.stats.friends_count}</div>
                    <div className="text-xs opacity-80">Amis</div>
                  </div>
                </div>
              </div>

              {/* Logo Fytli */}
              <div className="mt-4 text-center">
                <p className="text-sm font-semibold opacity-90">FYTLI</p>
                <p className="text-xs opacity-70">fytli.fr</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Overlay de génération */}
        {isGenerating && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
              <p>Génération en cours...</p>
            </div>
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-col gap-3">
        {!generatedImage ? (
          <button
            onClick={generateImage}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Génération...' : '📸 Générer la carte'}
          </button>
        ) : (
          <>
            <button
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
            >
              📤 Partager
            </button>
            <button
              onClick={() => downloadImage(generatedImage)}
              className="w-full bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-all shadow-lg"
            >
              💾 Télécharger
            </button>
            <button
              onClick={() => setGeneratedImage(null)}
              className="w-full bg-gray-200 text-gray-700 py-2 px-6 rounded-xl font-medium hover:bg-gray-300 transition-all"
            >
              Régénérer
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <p className="text-xs text-gray-500 text-center">
        Partagez votre progression sur Instagram, Threads ou vos réseaux préférés
      </p>
    </div>
  );
};

export default ShareCard;

