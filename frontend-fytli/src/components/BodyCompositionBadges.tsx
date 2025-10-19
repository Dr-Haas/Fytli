/**
 * Composant BodyCompositionBadges
 * Affiche les badges liés à la composition corporelle
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Spinner } from './ui/Spinner';
import bodyCompositionService, { BodyBadge } from '../services/bodyComposition';
import { Trophy, Award, Star } from 'lucide-react';

interface BadgeItemProps {
  badge: BodyBadge;
  index: number;
}

const BadgeItem = ({ badge, index }: BadgeItemProps) => {
  const earnedDate = new Date(badge.earned_at);
  const formattedDate = earnedDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      <Card className="card-fytli hover:shadow-lg transition-all overflow-hidden">
        {/* Gradient de fond */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${badge.gradient} opacity-5`}
        />
        
        <CardContent className="p-4 relative z-10">
          <div className="flex items-start gap-4">
            {/* Icône du badge */}
            <div 
              className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg"
              style={{ 
                backgroundColor: badge.color + '20',
                border: `2px solid ${badge.color}`
              }}
            >
              {badge.icon}
            </div>
            
            {/* Informations */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-lg" style={{ color: badge.color }}>
                  {badge.name}
                </h4>
                <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
                  <Star className="h-3 w-3" />
                  {badge.points}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {badge.description}
              </p>
              
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <Trophy className="h-3 w-3" />
                Débloqué le {formattedDate}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const BodyCompositionBadges = () => {
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState<BodyBadge[]>([]);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      setLoading(true);
      const data = await bodyCompositionService.getBodyBadges();
      setBadges(data);
    } catch (error) {
      console.error('Erreur lors du chargement des badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="card-fytli">
        <CardContent className="p-8 flex items-center justify-center">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  if (badges.length === 0) {
    return (
      <Card className="card-fytli">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-fytli-orange" />
            Badges de Composition Corporelle
          </CardTitle>
          <CardDescription>
            Débloquez des badges en atteignant vos objectifs
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Award className="h-16 w-16 text-muted-foreground opacity-50" />
            <div>
              <p className="font-semibold text-muted-foreground">
                Aucun badge débloqué pour le moment
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Continuez à enregistrer vos mesures et à atteindre vos objectifs pour débloquer des badges !
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPoints = badges.reduce((sum, badge) => sum + badge.points, 0);

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <Card className="card-fytli bg-gradient-to-br from-fytli-red/10 via-fytli-orange/10 to-amber-500/10 border-fytli-orange/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="h-6 w-6 text-fytli-orange" />
                Badges de Composition Corporelle
              </h3>
              <p className="text-muted-foreground mt-1">
                Vos accomplissements en matière de transformation corporelle
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-fytli-orange">
                {badges.length}
              </div>
              <p className="text-sm text-muted-foreground">
                {badges.length === 1 ? 'Badge débloqué' : 'Badges débloqués'}
              </p>
              <div className="flex items-center justify-end gap-1 mt-2 text-amber-500">
                <Star className="h-4 w-4" />
                <span className="font-semibold">{totalPoints} points</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {badges.map((badge, index) => (
          <BadgeItem key={badge.badge_id} badge={badge} index={index} />
        ))}
      </div>

      {/* Message d'encouragement */}
      <Card className="card-fytli border-dashed">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            💪 Continuez vos efforts ! Il reste encore {14 - badges.length} badges à débloquer.
            <br />
            <span className="text-sm">
              Enregistrez régulièrement vos mesures et travaillez vers vos objectifs pour en gagner davantage !
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

