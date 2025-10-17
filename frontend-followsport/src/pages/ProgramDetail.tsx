import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { programsService } from '../services/programs';
import { sessionsService } from '../services/sessions';
import { Program, Session } from '../types';
import { ArrowLeft, Play, Dumbbell, Clock, Zap } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';
import { showToast, getErrorMessage } from '../utils/toast';

export const ProgramDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const [programData, sessionsData] = await Promise.all([
          programsService.getById(parseInt(id)),
          sessionsService.getByProgramId(parseInt(id)),
        ]);
        setProgram(programData);
        setSessions(sessionsData);
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
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto space-y-6"
          >
            {/* Back button */}
            <button
              onClick={() => navigate('/programs')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux programmes
            </button>

            {/* Program Header */}
            <Card className="card-fytli">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold mb-2 text-gradient">
                      {program.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {program.description || 'Aucune description'}
                    </CardDescription>
                  </div>
                  {program.level && (
                    <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${levelColors[program.level]}`}>
                      {levelLabels[program.level]}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-6 mt-4 pt-4 border-t">
                  {program.duration_weeks && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{program.duration_weeks} semaines</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Dumbbell className="h-4 w-4" />
                    <span className="text-sm">{sessions.length} session(s)</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Sessions */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Sessions d'entraînement</h2>
              
              {sessions.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">
                    Aucune session pour ce programme
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="card-fytli hover:shadow-fytli-hover transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-fytli-red to-fytli-orange text-white font-bold">
                                  {session.day_number}
                                </span>
                                <div>
                                  <h3 className="text-xl font-bold">{session.title}</h3>
                                  {session.notes && (
                                    <p className="text-sm text-muted-foreground">
                                      {session.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleStartSession(session.id)}
                              className="btn-brand"
                              size="lg"
                            >
                              <Play className="h-5 w-5 mr-2" />
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

            {/* Motivation Card */}
            <Card className="bg-gradient-to-br from-fytli-red/5 to-fytli-orange/5 border-fytli-red/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-gradient-to-br from-fytli-red to-fytli-orange">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-fytli-dark">
                      Prêt(e) à bouger ? 💪
                    </p>
                    <p className="text-sm text-muted-foreground">
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

