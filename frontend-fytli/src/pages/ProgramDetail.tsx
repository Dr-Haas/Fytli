import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { programsService } from '../services/programs';
import { sessionsService } from '../services/sessions';
import enrollmentsService from '../services/enrollments';
import completionsService from '../services/completions';
import { Program, Session, ProgramEnrollment, SessionCompletion, ProgramStats } from '../types';
import { Play, Dumbbell, Clock, Zap, Users, UserPlus, UserMinus, Award, TrendingUp } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';
import { showToast, getErrorMessage } from '../utils/toast';

export const ProgramDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [enrolledUsers, setEnrolledUsers] = useState<ProgramEnrollment[]>([]);
  const [activityFeed, setActivityFeed] = useState<SessionCompletion[]>([]);
  const [stats, setStats] = useState<ProgramStats | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const [
          programData,
          sessionsData,
          usersData,
          feedData,
          statsData,
          enrollmentStatus
        ] = await Promise.all([
          programsService.getById(parseInt(id)),
          sessionsService.getByProgramId(parseInt(id)),
          enrollmentsService.getUsersByProgram(parseInt(id)),
          completionsService.getProgramActivityFeed(parseInt(id), 10),
          enrollmentsService.getProgramStats(parseInt(id)),
          enrollmentsService.checkEnrollment(parseInt(id)).catch(() => false)
        ]);
        
        setProgram(programData);
        setSessions(sessionsData);
        setEnrolledUsers(usersData);
        setActivityFeed(feedData);
        setStats(statsData);
        setIsEnrolled(enrollmentStatus);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        const message = getErrorMessage(error);
        showToast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleStartSession = (sessionId: number) => {
    navigate(`/session/${sessionId}`);
  };

  const handleEnroll = async () => {
    if (!id) return;
    setEnrolling(true);
    try {
      await enrollmentsService.enroll(parseInt(id));
      setIsEnrolled(true);
      showToast.success('Inscription réussie ! 🎉');
      // Rafraîchir les données
      const [usersData, statsData] = await Promise.all([
        enrollmentsService.getUsersByProgram(parseInt(id)),
        enrollmentsService.getProgramStats(parseInt(id)),
      ]);
      setEnrolledUsers(usersData);
      setStats(statsData);
    } catch (error) {
      const message = getErrorMessage(error);
      showToast.error(message);
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    if (!id) return;
    setEnrolling(true);
    try {
      await enrollmentsService.unenroll(parseInt(id));
      setIsEnrolled(false);
      showToast.success('Désinscription effectuée');
      // Rafraîchir les données
      const [usersData, statsData] = await Promise.all([
        enrollmentsService.getUsersByProgram(parseInt(id)),
        enrollmentsService.getProgramStats(parseInt(id)),
      ]);
      setEnrolledUsers(usersData);
      setStats(statsData);
    } catch (error) {
      const message = getErrorMessage(error);
      showToast.error(message);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 lg:p-8">
            <div className="text-center py-24">
              <p className="text-muted-foreground text-lg">Programme non trouvé</p>
              <Button onClick={() => navigate('/programs')} className="mt-4">
                Retour aux programmes
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const levelLabels = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
  };

  const levelColors = {
    beginner: 'text-green-600 bg-green-50',
    intermediate: 'text-blue-600 bg-blue-50',
    advanced: 'text-purple-600 bg-purple-50',
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
            className="max-w-5xl mx-auto space-y-4 lg:space-y-6"
          >
            {/* Program Header */}
            <Card className="card-fytli">
              <CardHeader className="p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl lg:text-3xl font-bold mb-2 text-gradient">
                      {program.title}
                    </CardTitle>
                    <CardDescription className="text-sm lg:text-base">
                      {program.description || 'Aucune description'}
                    </CardDescription>
                    {program.goal && (
                      <div className="mt-2 flex items-center gap-2">
                        <Award className="h-4 w-4 text-fytli-orange" />
                        <span className="text-sm font-medium text-fytli-dark">{program.goal}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2">
                    {program.level && (
                      <span className={`text-xs lg:text-sm font-medium px-2 lg:px-3 py-1 lg:py-1.5 rounded-full ${levelColors[program.level]}`}>
                        {levelLabels[program.level]}
                      </span>
                    )}
                    <Button
                      onClick={isEnrolled ? handleUnenroll : handleEnroll}
                      disabled={enrolling}
                      variant={isEnrolled ? 'outline' : 'default'}
                      className={`flex-1 lg:flex-none ${isEnrolled ? '' : 'btn-brand'}`}
                      size="sm"
                    >
                      {isEnrolled ? (
                        <>
                          <UserMinus className="h-4 w-4 mr-2" />
                          Se désinscrire
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Rejoindre
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:flex lg:items-center gap-3 lg:gap-6 mt-3 lg:mt-4 pt-3 lg:pt-4 border-t">
                  {program.duration_weeks && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs lg:text-sm">{program.duration_weeks} sem.</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Dumbbell className="h-4 w-4" />
                    <span className="text-xs lg:text-sm">{sessions.length} session(s)</span>
                  </div>
                  {stats && (
                    <>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span className="text-xs lg:text-sm">{stats.active_users} part.</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs lg:text-sm">{stats.total_completions} complétées</span>
                      </div>
                    </>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Sessions */}
            <div className="space-y-3 lg:space-y-4">
              <h2 className="text-xl lg:text-2xl font-bold">Sessions d'entraînement</h2>
              
              {sessions.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">
                    Aucune session pour ce programme
                  </p>
                </Card>
              ) : (
                <div className="space-y-3 lg:space-y-4">
                  {sessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="card-fytli hover:shadow-fytli-hover transition-all">
                        <CardContent className="p-4 lg:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 lg:gap-3 mb-2">
                                <span className="flex items-center justify-center h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-gradient-to-br from-fytli-red to-fytli-orange text-white font-bold text-sm lg:text-base">
                                  {session.order || session.day_number || index + 1}
                                </span>
                                <div>
                                  <h3 className="text-lg lg:text-xl font-bold">{session.title}</h3>
                                  {session.notes && (
                                    <p className="text-xs lg:text-sm text-muted-foreground">
                                      {session.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleStartSession(session.id)}
                              className="btn-brand w-full sm:w-auto"
                              size="default"
                            >
                              <Play className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                              Let's Go!
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Enrolled Users & Activity Feed */}
            {enrolledUsers.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Participants */}
                <Card>
                  <CardHeader className="p-4 lg:p-6">
                    <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
                      <Users className="h-4 w-4 lg:h-5 lg:w-5 text-fytli-red" />
                      Participants ({enrolledUsers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6">
                    <div className="space-y-2 lg:space-y-3">
                      {enrolledUsers.slice(0, 5).map((enrollment) => (
                        <div
                          key={enrollment.id}
                          className="flex items-center justify-between p-2 lg:p-3 rounded-lg bg-fytli-cream hover:bg-fytli-cream/70 transition-colors cursor-pointer touch-target"
                          onClick={() => navigate(`/profile/${enrollment.user_id}`)}
                        >
                          <div className="flex items-center gap-2 lg:gap-3">
                            <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-gradient-to-br from-fytli-red to-fytli-orange flex items-center justify-center text-white font-bold text-xs lg:text-base">
                              {enrollment.first_name?.[0]}{enrollment.last_name?.[0]}
                            </div>
                            <div>
                              <p className="font-medium text-sm lg:text-base">
                                {enrollment.first_name} {enrollment.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {enrollment.sessions_completed || 0} sessions
                              </p>
                            </div>
                          </div>
                          <Award className="h-4 w-4 lg:h-5 lg:w-5 text-fytli-orange" />
                        </div>
                      ))}
                      {enrolledUsers.length > 5 && (
                        <p className="text-xs lg:text-sm text-center text-muted-foreground pt-2">
                          +{enrolledUsers.length - 5} autres participants
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Feed */}
                <Card>
                  <CardHeader className="p-4 lg:p-6">
                    <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
                      <Zap className="h-4 w-4 lg:h-5 lg:w-5 text-fytli-orange" />
                      Activité récente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6">
                    {activityFeed.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">
                        Aucune activité récente
                      </p>
                    ) : (
                      <div className="space-y-2 lg:space-y-3">
                        {activityFeed.slice(0, 5).map((completion) => (
                          <div
                            key={completion.id}
                            className="flex items-start gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg bg-fytli-cream"
                          >
                            <div className="h-7 w-7 lg:h-8 lg:w-8 rounded-full bg-gradient-to-br from-fytli-red to-fytli-orange flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {completion.first_name?.[0]}{completion.last_name?.[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs lg:text-sm">
                                <span className="font-medium">{completion.first_name}</span> a terminé{' '}
                                <span className="font-medium">{completion.session_title}</span>
                              </p>
                              <p className="text-[10px] lg:text-xs text-muted-foreground">
                                {new Date(completion.completed_at).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}


            {/* Motivation Card */}
            <Card className="bg-gradient-to-br from-fytli-red/5 to-fytli-orange/5 border-fytli-red/20">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="p-2 lg:p-3 rounded-full bg-gradient-to-br from-fytli-red to-fytli-orange">
                    <Zap className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm lg:text-base text-fytli-dark">
                      Prêt(e) à bouger ? 💪
                    </p>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      20 minutes suffisent pour faire la différence.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

