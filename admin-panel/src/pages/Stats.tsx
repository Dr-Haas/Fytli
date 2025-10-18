import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin';
import { Stats as StatsType } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import LoadingSpinner from '@/components/LoadingSpinner';
import StatCard from '@/components/StatCard';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Award, 
  TrendingUp,
  UserCheck,
  Activity
} from 'lucide-react';
import { formatNumber } from '@/utils/format';
import toast from 'react-hot-toast';

export default function Stats() {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    );
  }

  // Calculs de statistiques avancées
  const avgSessionsPerUser = stats.total_users > 0 
    ? (stats.total_completions / stats.total_users).toFixed(1)
    : '0';

  const avgEnrollmentsPerUser = stats.total_users > 0
    ? (stats.active_enrollments / stats.total_users).toFixed(1)
    : '0';

  const completionRate = stats.total_sessions > 0
    ? ((stats.total_completions / stats.total_sessions) * 100).toFixed(1)
    : '0';

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistiques détaillées</h1>
        <p className="text-gray-600">Vue d'ensemble complète de votre plateforme</p>
      </div>

      {/* Stats principales */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vue d'ensemble</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Utilisateurs totaux"
            value={formatNumber(stats.total_users)}
            icon={Users}
            description={`+${stats.users_today} aujourd'hui`}
          />
          <StatCard
            title="Programmes"
            value={formatNumber(stats.total_programs)}
            icon={BookOpen}
            description="Programmes disponibles"
          />
          <StatCard
            title="Sessions"
            value={formatNumber(stats.total_sessions)}
            icon={Calendar}
            description="Sessions créées"
          />
          <StatCard
            title="Complétions"
            value={formatNumber(stats.total_completions)}
            icon={TrendingUp}
            description={`+${stats.completions_today} aujourd'hui`}
          />
        </div>
      </div>

      {/* Stats d'engagement */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Engagement des utilisateurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Inscriptions actives</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatNumber(stats.active_enrollments)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Moy. {avgEnrollmentsPerUser} par utilisateur
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Badges gagnés</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatNumber(stats.total_badges_earned)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Récompenses distribuées
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Taux de complétion</p>
                <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
                <p className="text-xs text-gray-500 mt-2">
                  Sessions complétées
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats moyennes */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Moyennes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sessions par utilisateur</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary-600">{avgSessionsPerUser}</p>
              <p className="text-sm text-gray-500 mt-2">
                Nombre moyen de sessions complétées par utilisateur
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inscriptions par utilisateur</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary-600">{avgEnrollmentsPerUser}</p>
              <p className="text-sm text-gray-500 mt-2">
                Nombre moyen de programmes suivis par utilisateur
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessions par programme</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary-600">
                {stats.total_programs > 0
                  ? (stats.total_sessions / stats.total_programs).toFixed(1)
                  : '0'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Nombre moyen de sessions par programme
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activité récente */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Activité d'aujourd'hui</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Nouveaux utilisateurs
                </p>
                <p className="text-4xl font-bold text-gray-900">{stats.users_today}</p>
              </div>
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Sessions complétées
                </p>
                <p className="text-4xl font-bold text-gray-900">{stats.completions_today}</p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

