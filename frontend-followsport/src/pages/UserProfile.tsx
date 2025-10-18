import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import enrollmentsService from '../services/enrollments';
import completionsService from '../services/completions';
import { badgesService } from '../services/badges';
import { UserProgramEnrollment, SessionCompletion } from '../types';
import { UserBadge } from '../types/badges';
import { ArrowLeft, Trophy, Dumbbell, CheckCircle, Clock, Award, TrendingUp, Calendar, Eye } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';
import { showToast, getErrorMessage } from '../utils/toast';

export const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<UserProgramEnrollment[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [recentSessions, setRecentSessions] = useState<SessionCompletion[]>([]);
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      try {
        const [programsData, badgesData, sessionsData] = await Promise.all([
          enrollmentsService.getProgramsByUser(parseInt(userId)),
          badgesService.getUserEarnedBadges(parseInt(userId)).catch(() => []),
          completionsService.getByUser(parseInt(userId)).catch(() => [])
        ]);
        
        setPrograms(programsData);
        setBadges(badgesData);
        
        // Trier et prendre les 10 dernières sessions
        const sortedSessions = sessionsData
          .sort((a: SessionCompletion, b: SessionCompletion) => 
            new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
          )
          .slice(0, 10);
        setRecentSessions(sortedSessions);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        const message = getErrorMessage(error);
        showToast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalSessions = programs.reduce((acc, p) => acc + (p.sessions_completed || 0), 0);
  const activePrograms = programs.filter(p => p.status === 'active').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'completed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'paused':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'completed':
        return 'Terminé';
      case 'paused':
        return 'En pause';
      case 'abandoned':
        return 'Abandonné';
      default:
        return status;
    }
  };

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
            className="max-w-6xl mx-auto space-y-4 lg:space-y-6"
          >
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors touch-target"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>

            {/* User Header */}
            <Card className="card-fytli">
              <CardHeader className="p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-gradient-to-br from-fytli-red to-fytli-orange flex items-center justify-center text-white text-2xl lg:text-3xl font-bold">
                    {userId}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl lg:text-3xl font-bold mb-2 text-gradient">
                      Profil Utilisateur
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-xs lg:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Dumbbell className="h-3 w-3 lg:h-4 lg:w-4" />
                        <span>{activePrograms} prog.</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4" />
                        <span>{totalSessions} sessions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-3 w-3 lg:h-4 lg:w-4" />
                        <span>{badges.length} badges</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              <Card className="card-fytli">
                <CardContent className="p-4 lg:p-6 text-center">
                  <Dumbbell className="h-8 w-8 lg:h-10 lg:w-10 mx-auto mb-2 lg:mb-3 text-fytli-red" />
                  <div className="text-2xl lg:text-3xl font-bold text-fytli-dark mb-1">
                    {programs.length}
                  </div>
                  <div className="text-xs lg:text-sm text-muted-foreground">
                    Programmes inscrits
                  </div>
                </CardContent>
              </Card>

              <Card className="card-fytli">
                <CardContent className="p-4 lg:p-6 text-center">
                  <TrendingUp className="h-8 w-8 lg:h-10 lg:w-10 mx-auto mb-2 lg:mb-3 text-fytli-orange" />
                  <div className="text-2xl lg:text-3xl font-bold text-fytli-dark mb-1">
                    {totalSessions}
                  </div>
                  <div className="text-xs lg:text-sm text-muted-foreground">
                    Sessions complétées
                  </div>
                </CardContent>
              </Card>

              <Card className="card-fytli">
                <CardContent className="p-4 lg:p-6 text-center">
                  <Trophy className="h-8 w-8 lg:h-10 lg:w-10 mx-auto mb-2 lg:mb-3 text-green-600" />
                  <div className="text-2xl lg:text-3xl font-bold text-fytli-dark mb-1">
                    {badges.length}
                  </div>
                  <div className="text-xs lg:text-sm text-muted-foreground">
                    Badges obtenus
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Programs */}
            <div className="space-y-3 lg:space-y-4">
              <h2 className="text-xl lg:text-2xl font-bold flex items-center gap-2">
                <Dumbbell className="h-5 w-5 lg:h-6 lg:w-6 text-fytli-red" />
                Programmes
              </h2>
              
              {programs.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">
                    Aucun programme pour cet utilisateur
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {programs.map((program) => {
                    const progress = program.total_sessions > 0 
                      ? Math.round((program.sessions_completed / program.total_sessions) * 100)
                      : 0;
                    
                    return (
                      <motion.div
                        key={program.enrollment_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card 
                          className="card-fytli hover:shadow-fytli-hover transition-all cursor-pointer"
                          onClick={() => navigate(`/programs/${program.id}`)}
                        >
                          <CardHeader className="p-4 lg:p-6">
                            <div className="flex items-start justify-between mb-2 lg:mb-3">
                              <CardTitle className="text-lg lg:text-xl">{program.title}</CardTitle>
                              <span className={`text-[10px] lg:text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(program.status)}`}>
                                {getStatusLabel(program.status)}
                              </span>
                            </div>
                            {program.description && (
                              <p className="text-xs lg:text-sm text-muted-foreground line-clamp-2">
                                {program.description}
                              </p>
                            )}
                          </CardHeader>
                          <CardContent className="p-4 lg:p-6">
                            <div className="space-y-2 lg:space-y-3">
                              {/* Progress bar */}
                              <div>
                                <div className="flex items-center justify-between text-xs lg:text-sm mb-1 lg:mb-2">
                                  <span className="text-muted-foreground">Progression</span>
                                  <span className="font-medium">{progress}%</span>
                                </div>
                                <div className="h-2 bg-fytli-cream rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-fytli-red to-fytli-orange transition-all"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>

                              {/* Stats */}
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs lg:text-sm">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4" />
                                  <span>{program.sessions_completed} / {program.total_sessions} sessions</span>
                                </div>
                                {program.duration_weeks && (
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
                                    <span>{program.duration_weeks} sem.</span>
                                  </div>
                                )}
                              </div>

                              {/* Enrolled date */}
                              <div className="text-[10px] lg:text-xs text-muted-foreground">
                                Inscrit le {new Date(program.enrolled_at).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Sessions */}
            <div className="space-y-3 lg:space-y-4">
              <h2 className="text-xl lg:text-2xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 lg:h-6 lg:w-6 text-fytli-red" />
                Dernières sessions ({recentSessions.length})
              </h2>
              
              {recentSessions.length === 0 ? (
                <Card className="p-12 text-center">
                  <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Aucune session réalisée pour le moment
                  </p>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                    {recentSessions.slice(0, showAllSessions ? recentSessions.length : 3).map((session, index) => {
                    const feelingEmojis = {
                      terrible: '😖',
                      bad: '😞',
                      okay: '😐',
                      good: '😊',
                      excellent: '🤩',
                    };
                    
                    return (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card 
                          className="card-fytli hover:shadow-fytli-hover transition-all cursor-pointer touch-target"
                          onClick={() => navigate(`/completion/${session.id}`)}
                        >
                          <CardContent className="p-3 lg:p-4">
                            <div className="flex items-start gap-2 lg:gap-3">
                              <div className="text-2xl lg:text-3xl">
                                {feelingEmojis[session.feeling || 'good']}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm lg:text-base text-fytli-dark truncate">
                                  {session.session_title || 'Session'}
                                </h3>
                                <p className="text-xs lg:text-sm text-muted-foreground truncate">
                                  {session.program_title}
                                </p>
                                <div className="flex items-center gap-2 lg:gap-3 mt-1 lg:mt-2 text-[10px] lg:text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{session.duration_minutes || 0} min</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(session.completed_at).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'short'
                                    })}</span>
                                  </div>
                                </div>
                                {session.photo_url && (
                                  <div className="mt-1 lg:mt-2 flex items-center gap-1 text-[10px] lg:text-xs text-fytli-red">
                                    <Eye className="h-3 w-3" />
                                    <span>Photo disponible</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                  </div>
                  
                  {/* Bouton "Voir plus" */}
                  {recentSessions.length > 3 && (
                    <div className="flex justify-center mt-4">
                      <Button
                        onClick={() => setShowAllSessions(!showAllSessions)}
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        {showAllSessions ? 'Voir moins' : `Voir plus (${recentSessions.length - 3} autres)`}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Badges */}
            <div className="space-y-3 lg:space-y-4">
              <h2 className="text-xl lg:text-2xl font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5 lg:h-6 lg:w-6 text-fytli-orange" />
                Badges obtenus ({badges.length})
              </h2>
              
              {badges.length === 0 ? (
                <Card className="p-12 text-center">
                  <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Aucun badge pour le moment
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Continue à t'entraîner pour débloquer des badges !
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                  {badges.map((badge) => (
                    <Card
                      key={badge.badge_id}
                      className="card-fytli text-center hover:shadow-fytli-hover transition-all"
                    >
                      <CardContent className="p-4 lg:p-6">
                        <div className="h-12 w-12 lg:h-16 lg:w-16 rounded-full bg-gradient-to-br from-fytli-red to-fytli-orange flex items-center justify-center mx-auto mb-2 lg:mb-3">
                          <Trophy className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                        </div>
                        <h3 className="font-bold text-sm lg:text-base text-fytli-dark mb-1">
                          {badge.badge_id}
                        </h3>
                        <p className="text-[10px] lg:text-xs text-muted-foreground">
                          {new Date(badge.earned_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Call to action */}
            <Card className="bg-gradient-to-br from-fytli-red/5 to-fytli-orange/5 border-fytli-red/20">
              <CardContent className="p-4 lg:p-6 text-center">
                <Trophy className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-2 lg:mb-3 text-fytli-orange" />
                <p className="text-base lg:text-lg font-medium text-fytli-dark mb-1 lg:mb-2">
                  Continuez comme ça ! 💪
                </p>
                <p className="text-xs lg:text-sm text-muted-foreground mb-3 lg:mb-4">
                  Chaque session te rapproche de tes objectifs
                </p>
                <Button
                  onClick={() => navigate('/programs')}
                  className="btn-brand w-full sm:w-auto"
                >
                  Voir les programmes
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

