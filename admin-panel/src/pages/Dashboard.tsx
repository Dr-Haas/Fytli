import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Award, 
  TrendingUp,
  ArrowRight 
} from 'lucide-react';
import { adminService } from '@/services/admin';
import { Stats } from '@/types';
import StatCard from '@/components/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/Table';
import LoadingSpinner from '@/components/LoadingSpinner';
import Badge from '@/components/Badge';
import { formatDateShort, formatRelativeTime } from '@/utils/format';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
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

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Vue d'ensemble de votre plateforme Fytli</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Utilisateurs"
          value={stats.total_users}
          icon={Users}
          description={`+${stats.users_today} aujourd'hui`}
        />
        <StatCard
          title="Programmes"
          value={stats.total_programs}
          icon={BookOpen}
          description="Programmes créés"
        />
        <StatCard
          title="Sessions"
          value={stats.total_sessions}
          icon={Calendar}
          description="Sessions disponibles"
        />
        <StatCard
          title="Complétions"
          value={stats.total_completions}
          icon={TrendingUp}
          description={`+${stats.completions_today} aujourd'hui`}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Inscriptions actives</p>
              <p className="text-3xl font-bold text-gray-900">{stats.active_enrollments}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Badges gagnés</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total_badges_earned}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilisateurs récents */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Utilisateurs récents</CardTitle>
            <Link 
              to="/users" 
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              Voir tout
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recent_users && stats.recent_users.length > 0 ? (
              <div className="space-y-4">
                {stats.recent_users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={user.role === 'admin' ? 'info' : 'default'}>
                        {user.role}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatRelativeTime(user.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Aucun utilisateur récent</p>
            )}
          </CardContent>
        </Card>

        {/* Programmes populaires */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Programmes populaires</CardTitle>
            <Link 
              to="/programs" 
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              Voir tout
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            {stats.popular_programs && stats.popular_programs.length > 0 ? (
              <div className="space-y-4">
                {stats.popular_programs.slice(0, 5).map((program) => (
                  <div key={program.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{program.title}</p>
                      <p className="text-sm text-gray-500">
                        {program.duration_weeks} semaines · {program.difficulty_level}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-semibold text-primary-600">
                        {program.enrollment_count || 0}
                      </p>
                      <p className="text-xs text-gray-500">inscriptions</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Aucun programme disponible</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Complétions récentes */}
      {stats.recent_completions && stats.recent_completions.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Complétions récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Utilisateur</TableHeader>
                  <TableHeader>Session</TableHeader>
                  <TableHeader>Programme</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Durée</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.recent_completions.slice(0, 10).map((completion) => (
                  <TableRow key={completion.id}>
                    <TableCell>{completion.user_name || 'Utilisateur inconnu'}</TableCell>
                    <TableCell>{completion.session_title || 'Session inconnue'}</TableCell>
                    <TableCell>{completion.program_title || 'Programme inconnu'}</TableCell>
                    <TableCell>{formatDateShort(completion.completed_at)}</TableCell>
                    <TableCell>
                      {completion.duration_minutes ? `${completion.duration_minutes} min` : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

