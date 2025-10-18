import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { BadgeCard } from '../components/BadgeCard';
import { Card, CardContent } from '../components/ui/Card';
import { BADGE_CATEGORIES } from '../types/badges';
import { Trophy, Award, TrendingUp, Loader2 } from 'lucide-react';
import { badgesService } from '../services/badges';
import { useAuth } from '../hooks/useAuth';
import { showToast, getErrorMessage } from '../utils/toast';

interface UserBadgeWithProgress {
  badge_id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  category: string;
  requirement: string;
  points?: number;
  is_secret: number | boolean; // 0 or 1 from DB, or boolean
  earned: number | boolean; // 0 or 1 from DB, or boolean
  earned_at?: string | null;
  progress_percent: number;
}

export const Badges = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<UserBadgeWithProgress[]>([]);
  const [overview, setOverview] = useState({
    badges_earned: 0,
    total_points: 0,
    total_badges: 10,
    completion_percent: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch badges from API
  useEffect(() => {
    const fetchBadges = async () => {
      if (!user) return;

      try {
        const data = await badgesService.getUserBadgesWithProgress(user.id);
        console.log('Badges data received:', data);
        
        if (data && data.data && Array.isArray(data.data)) {
          setBadges(data.data as UserBadgeWithProgress[]);
          setOverview(data.overview);
        } else {
          console.error('Invalid data structure:', data);
          setBadges([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des badges:', error);
        const message = getErrorMessage(error);
        showToast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [user]);

  const earnedCount = overview.badges_earned;
  const totalCount = overview.total_badges;
  const completionRate = Math.round(overview.completion_percent);

  // Filtrer par catégorie
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filteredBadges = selectedCategory
    ? badges.filter(badge => badge.category === selectedCategory)
    : badges;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-fytli-red mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des badges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="lg:ml-64 p-4 lg:p-8">
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
              {Object.entries(BADGE_CATEGORIES).map(([key, categoryInfo]) => {
                const count = badges.filter(b => b.category === key).length;
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
                    {categoryInfo.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Grille de badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBadges.map((badge, index) => {
                // Sécurité : vérifier que le badge a toutes les propriétés requises
                if (!badge || !badge.badge_id) {
                  console.warn('Invalid badge data:', badge);
                  return null;
                }
                
                return (
                  <motion.div
                    key={badge.badge_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <BadgeCard
                      badge={{
                        id: badge.badge_id as any,
                        name: badge.name || 'Badge',
                        description: badge.description || '',
                        icon: badge.icon || '🏆',
                        color: badge.color || '#FF4D3A',
                        gradient: badge.gradient || 'from-fytli-red to-fytli-orange',
                        category: (badge.category || 'routine') as 'routine' | 'performance' | 'health' | 'achievement',
                        requirement: badge.requirement || '',
                      } as any}
                      earned={Boolean(badge.earned)}
                      earnedAt={badge.earned_at || undefined}
                      progress={badge.progress_percent || 0}
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
  );
};

