import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import enrollmentsService from '../services/enrollments';
import completionsService from '../services/completions';
import { badgesService } from '../services/badges';
import { 
  Dumbbell, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Flame,
  CheckCircle2,
  ArrowRight,
  Target,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProgramEnrollment {
  id: number;
  program_id: number;
  program_title: string;
  program_level: string;
  sessions_completed: number;
  total_sessions: number;
  status: string;
}

interface SessionCompletion {
  id: number;
  session_id: number;
  session_title?: string;
  program_title?: string;
  completed_at: string;
  feeling?: string;
  duration_minutes?: number;
}

interface UserBadge {
  badge_id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  earned_at: string;
}

interface WeekDay {
  date: Date;
  dayName: string;
  isToday: boolean;
  completions: number;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [programs, setPrograms] = useState<UserProgramEnrollment[]>([]);
  const [recentCompletions, setRecentCompletions] = useState<SessionCompletion[]>([]);
  const [recentBadges, setRecentBadges] = useState<UserBadge[]>([]);
  const [weekData, setWeekData] = useState<WeekDay[]>([]);
  const [stats, setStats] = useState({
    activePrograms: 0,
    sessionsThisWeek: 0,
    badgesEarned: 0,
    currentStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        // Fetch all data in parallel
        const [programsData, completionsData, badgesData] = await Promise.all([
          enrollmentsService.getProgramsByUser(user.id),
          completionsService.getByUser(user.id),
          badgesService.getUserEarnedBadges(user.id).catch(() => []),
        ]);

        setPrograms(programsData.slice(0, 3) as any); // Top 3 programs
        
        // Recent completions (last 5)
        const sortedCompletions = completionsData
          .sort((a: SessionCompletion, b: SessionCompletion) => 
            new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
          )
          .slice(0, 5);
        setRecentCompletions(sortedCompletions);

        // Recent badges (last 3)
        const sortedBadges = badgesData
          .sort((a: any, b: any) => 
            new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime()
          )
          .slice(0, 3);
        setRecentBadges(sortedBadges as any);

        // Calculate stats
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const sessionsThisWeek = completionsData.filter((c: SessionCompletion) => 
          new Date(c.completed_at) >= oneWeekAgo
        ).length;

        // Calculate streak
        const streak = calculateStreak(completionsData);

        setStats({
          activePrograms: programsData.length,
          sessionsThisWeek,
          badgesEarned: badgesData.length,
          currentStreak: streak,
        });

        // Generate week data
        const week = generateWeekData(completionsData);
        setWeekData(week);

      } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Calculate consecutive days streak
  const calculateStreak = (completions: SessionCompletion[]): number => {
    if (completions.length === 0) return 0;

    const sortedDates = completions
      .map(c => new Date(c.completed_at).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index) // Unique dates
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    let currentDate = new Date();

    for (const dateStr of sortedDates) {
      const checkDate = currentDate.toDateString();
      
      if (dateStr === checkDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  // Generate week data with completion counts
  const generateWeekData = (completions: SessionCompletion[]): WeekDay[] => {
    const week: WeekDay[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayCompletions = completions.filter(c => {
        const completionDate = new Date(c.completed_at);
        return completionDate.toDateString() === date.toDateString();
      }).length;

      week.push({
        date,
        dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        isToday: i === 0,
        completions: dayCompletions,
      });
    }

    return week;
  };

  const getFeelingEmoji = (feeling?: string) => {
    switch (feeling) {
      case 'excellent': return '🤩';
      case 'good': return '😊';
      case 'okay': return '😐';
      case 'bad': return '😞';
      case 'terrible': return '😖';
      default: return '💪';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fytli-red mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      icon: Dumbbell,
      label: 'Programmes actifs',
      value: stats.activePrograms,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      icon: CheckCircle2,
      label: 'Sessions cette semaine',
      value: stats.sessionsThisWeek,
      color: 'from-fytli-success to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      icon: Trophy,
      label: 'Badges débloqués',
      value: stats.badgesEarned,
      color: 'from-amber-400 to-fytli-orange',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      icon: Flame,
      label: 'Série en cours',
      value: `${stats.currentStreak} jour${stats.currentStreak > 1 ? 's' : ''}`,
      color: 'from-fytli-red to-fytli-orange',
      bgColor: 'bg-red-50',
      textColor: 'text-fytli-red',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 pt-20 lg:pt-4 lg:ml-64 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto space-y-4 lg:space-y-6"
          >
            {/* Welcome Section */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-1 lg:mb-2 text-gradient font-brand">
                Bienvenue, {user?.firstname} ! 👋
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                Voici ta synthèse d'entraînement
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {statsData.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="card-fytli">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4">
                        <div className={`p-2 lg:p-3 rounded-full bg-gradient-to-br ${stat.color}`}>
                          <stat.icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-xl lg:text-2xl font-bold text-fytli-dark">
                            {stat.value}
                          </div>
                          <div className="text-xs lg:text-sm text-muted-foreground">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              {/* Left Column: Programs + Calendar */}
              <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                {/* Week Calendar */}
                <Card className="card-fytli">
                  <CardHeader className="p-4 lg:p-6">
                    <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                      <Calendar className="h-4 w-4 lg:h-5 lg:w-5 text-fytli-red" />
                      Ta semaine
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6">
                    <div className="grid grid-cols-7 gap-1 lg:gap-2">
                      {weekData.map((day, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`
                            relative p-2 lg:p-4 rounded-lg text-center transition-all
                            ${day.isToday 
                              ? 'bg-gradient-to-br from-fytli-red to-fytli-orange text-white ring-2 ring-fytli-red ring-offset-2' 
                              : day.completions > 0
                                ? 'bg-fytli-success/10 border-2 border-fytli-success'
                                : 'bg-fytli-cream border border-fytli-line'
                            }
                          `}
                        >
                          <div className={`text-[10px] lg:text-xs font-medium mb-1 ${day.isToday ? 'text-white' : 'text-muted-foreground'}`}>
                            {day.dayName.substring(0, 2)}
                          </div>
                          <div className={`text-sm lg:text-lg font-bold mb-1 lg:mb-2 ${day.isToday ? 'text-white' : 'text-fytli-dark'}`}>
                            {day.date.getDate()}
                          </div>
                          {day.completions > 0 ? (
                            <div className="flex flex-col items-center gap-0.5 lg:gap-1">
                              <CheckCircle2 className={`h-3 w-3 lg:h-5 lg:w-5 ${day.isToday ? 'text-white' : 'text-fytli-success'}`} />
                              <span className={`text-[10px] lg:text-xs font-semibold ${day.isToday ? 'text-white' : 'text-fytli-success'}`}>
                                {day.completions}
                              </span>
                            </div>
                          ) : (
                            <div className={`text-lg lg:text-2xl ${day.isToday ? 'opacity-50' : 'opacity-30'}`}>•</div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-3 lg:mt-4 flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-4 text-xs lg:text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-fytli-success/20 border-2 border-fytli-success"></div>
                        <span>Session complétée</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gradient-to-br from-fytli-red to-fytli-orange"></div>
                        <span>Aujourd'hui</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Programs */}
                <Card className="card-fytli">
                  <CardHeader className="flex flex-row items-center justify-between p-4 lg:p-6">
                    <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                      <Dumbbell className="h-4 w-4 lg:h-5 lg:w-5 text-fytli-red" />
                      Mes programmes actifs
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/programs')}
                      className="text-fytli-red hover:text-fytli-red/80"
                    >
                      Voir tout
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6">
                    {programs.length > 0 ? (
                      <div className="space-y-3 lg:space-y-4">
                        {programs.map((program, index) => {
                          const progress = program.total_sessions > 0 
                            ? Math.round((program.sessions_completed / program.total_sessions) * 100)
                            : 0;

                          return (
                            <motion.div
                              key={program.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => navigate(`/programs/${program.program_id}`)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-lg">{program.program_title}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  program.program_level === 'beginner' ? 'bg-green-100 text-green-700' :
                                  program.program_level === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {program.program_level}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex-1 h-2 bg-fytli-line rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, delay: index * 0.2 }}
                                    className="h-full bg-gradient-to-r from-fytli-red to-fytli-orange"
                                  />
                                </div>
                                <span className="text-sm font-semibold text-fytli-red">
                                  {progress}%
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {program.sessions_completed} / {program.total_sessions} séances complétées
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Aucun programme actif</p>
                        <Button 
                          onClick={() => navigate('/programs')}
                          className="mt-4 btn-brand"
                        >
                          Explorer les programmes
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Badges + Activity */}
              <div className="space-y-4 lg:space-y-6">
                {/* Recent Badges */}
                <Card className="card-fytli">
                  <CardHeader className="p-4 lg:p-6">
                    <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                      <Trophy className="h-4 w-4 lg:h-5 lg:w-5 text-fytli-red" />
                      Badges récents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6">
                    {recentBadges.length > 0 ? (
                      <div className="space-y-3">
                        {recentBadges.map((badge, index) => (
                          <motion.div
                            key={badge.badge_id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="p-3 rounded-lg border bg-gradient-to-br from-fytli-cream to-white hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-3xl">{badge.icon}</div>
                              <div className="flex-1">
                                <div className="font-semibold text-sm">{badge.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(badge.earned_at).toLocaleDateString('fr-FR', { 
                                    day: 'numeric', 
                                    month: 'short' 
                                  })}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate('/profile')}
                        >
                          Voir tous les badges
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <Trophy className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Aucun badge débloqué</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="card-fytli">
                  <CardHeader className="p-4 lg:p-6">
                    <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                      <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-fytli-red" />
                      Activité récente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6">
                    {recentCompletions.length > 0 ? (
                      <div className="space-y-3">
                        {recentCompletions.map((completion, index) => (
                          <motion.div
                            key={completion.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-fytli-cream transition-colors"
                          >
                            <div className="text-2xl">
                              {getFeelingEmoji(completion.feeling)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {completion.session_title || 'Session'}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {completion.program_title}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(completion.completed_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Aucune activité récente</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="card-fytli bg-gradient-to-br from-fytli-red to-fytli-orange text-white">
                  <CardContent className="p-4 lg:p-6">
                    <Target className="h-6 w-6 lg:h-8 lg:w-8 mb-2 lg:mb-3" />
                    <h3 className="font-bold text-base lg:text-lg mb-1 lg:mb-2">
                      Prêt pour une séance ?
                    </h3>
                    <p className="text-xs lg:text-sm opacity-90 mb-3 lg:mb-4">
                      Continue ta série de {stats.currentStreak} jour{stats.currentStreak > 1 ? 's' : ''} !
                    </p>
                    <Button 
                      onClick={() => navigate('/programs')}
                      className="w-full bg-white text-fytli-red hover:bg-white/90"
                    >
                      Commencer maintenant
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};
