import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { BadgeCard } from '../components/BadgeCard';
import { Card, CardContent } from '../components/ui/Card';
import { BADGES, BADGE_CATEGORIES, BadgeId, UserBadge } from '../types/badges';
import { Trophy, Award, TrendingUp } from 'lucide-react';

export const Badges = () => {
  // TODO: Récupérer depuis l'API
  const [userBadges] = useState<UserBadge[]>([
    { badge_id: 'constance', earned_at: '2025-10-10T10:00:00Z' },
    { badge_id: 'routine_matinale', earned_at: '2025-10-15T08:30:00Z' },
    { badge_id: 'objectif_atteint', earned_at: '2025-10-16T20:00:00Z' },
  ]);

  // Badges en cours de progression (données de test)
  const [badgeProgress] = useState<Partial<Record<BadgeId, number>>>({
    progression: 65,
    sante_cardiaque: 40,
    challenge_reussi: 80,
  });

  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id));
  const allBadges = Object.values(BADGES);
  
  const earnedCount = userBadges.length;
  const totalCount = allBadges.length;
  const completionRate = Math.round((earnedCount / totalCount) * 100);

  // Filtrer par catégorie
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filteredBadges = selectedCategory
    ? allBadges.filter(badge => badge.category === selectedCategory)
    : allBadges;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-gradient font-brand">
                  Badges & Succès
                </h1>
                <p className="text-muted-foreground">
                  Débloque des badges en atteignant tes objectifs
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="card-fytli">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-fytli-red to-fytli-orange">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-fytli-dark">
                        {earnedCount}/{totalCount}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Badges débloqués
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-fytli">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-fytli-orange to-amber-500">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-fytli-dark">
                        {completionRate}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Complétion
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-fytli">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-fytli-success to-green-600">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-fytli-dark">
                        +{earnedCount}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Ce mois-ci
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress bar global */}
            <Card className="card-fytli">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-fytli-dark">
                    Progression globale
                  </span>
                  <span className="text-sm font-bold text-fytli-orange">
                    {completionRate}%
                  </span>
                </div>
                <div className="h-3 bg-fytli-cream rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-fytli-red to-fytli-orange"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Filtres par catégorie */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${selectedCategory === null
                    ? 'bg-gradient-to-r from-fytli-red to-fytli-orange text-white'
                    : 'bg-fytli-cream text-fytli-dark hover:bg-fytli-line'
                  }
                `}
              >
                Tous ({totalCount})
              </button>
              {Object.entries(BADGE_CATEGORIES).map(([key, category]) => {
                const count = allBadges.filter(b => b.category === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${selectedCategory === key
                        ? 'bg-gradient-to-r from-fytli-red to-fytli-orange text-white'
                        : 'bg-fytli-cream text-fytli-dark hover:bg-fytli-line'
                      }
                    `}
                  >
                    {category.icon} {category.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Grille de badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBadges.map((badge, index) => {
                const earned = earnedBadgeIds.has(badge.id);
                const userBadge = userBadges.find(ub => ub.badge_id === badge.id);
                const progress = badgeProgress[badge.id];

                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <BadgeCard
                      badge={badge}
                      earned={earned}
                      earnedAt={userBadge?.earned_at}
                      progress={progress}
                      onClick={() => {
                        // TODO: Ouvrir une modal avec les détails du badge
                        console.log('Badge clicked:', badge.id);
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Message si aucun badge dans la catégorie */}
            {filteredBadges.length === 0 && (
              <div className="text-center py-24">
                <p className="text-muted-foreground text-lg">
                  Aucun badge dans cette catégorie
                </p>
              </div>
            )}

            {/* Motivation card */}
            <Card className="bg-gradient-to-br from-fytli-red/5 to-fytli-orange/5 border-fytli-red/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Trophy className="h-6 w-6 text-fytli-red" />
                  <p className="text-lg font-medium text-fytli-dark">
                    Continue comme ça ! 🔥
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {earnedCount === 0 && "Commence ton aventure et débloque ton premier badge"}
                  {earnedCount > 0 && earnedCount < 5 && "Tu es sur la bonne voie ! Continue d'avancer"}
                  {earnedCount >= 5 && earnedCount < 8 && "Excellente progression ! Plus que quelques badges"}
                  {earnedCount >= 8 && earnedCount < totalCount && "Presque tous débloqués ! Tu assures"}
                  {earnedCount === totalCount && "Incroyable ! Tu as tous les badges ! Tu incarnes l'esprit Fytli 💫"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

