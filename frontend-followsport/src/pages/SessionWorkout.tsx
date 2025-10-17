import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { sessionsService } from '../services/sessions';
import { Session, SessionExercise, Exercise } from '../types';
import { ArrowLeft, Check, ChevronRight, Timer } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';
import { showToast, getErrorMessage } from '../utils/toast';

interface ExerciseWithDetails extends SessionExercise {
  exercise: Exercise;
}

export const SessionWorkout = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [exercises, setExercises] = useState<ExerciseWithDetails[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const sessionData = await sessionsService.getById(parseInt(id));
        // TODO: Implémenter la récupération des exercices de la session
        // Pour le moment, on utilise des données de test
        setSession(sessionData);
        setExercises([]);
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

  useEffect(() => {
    if (isResting && restTimeLeft > 0) {
      const timer = setTimeout(() => {
        setRestTimeLeft(restTimeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isResting && restTimeLeft === 0) {
      setIsResting(false);
    }
  }, [isResting, restTimeLeft]);

  const currentExercise = exercises[currentExerciseIndex];

  const handleSetComplete = () => {
    if (!currentExercise) return;

    if (currentSet < currentExercise.sets) {
      // Passer à la série suivante avec repos
      setRestTimeLeft(currentExercise.rest_time_sec);
      setIsResting(true);
      setCurrentSet(currentSet + 1);
    } else {
      // Exercice terminé, passer au suivant
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
        setIsResting(false);
      } else {
        // Séance terminée !
        setIsCompleted(true);
      }
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setRestTimeLeft(0);
  };

  const handleFinishSession = () => {
    const duration = Math.round((Date.now() - startTime) / 1000 / 60); // en minutes
    navigate('/session-summary', {
      state: {
        session,
        exercises,
        duration,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-fytli-cream flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-fytli-cream flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Session non trouvée</p>
            <Button onClick={() => navigate('/programs')}>
              Retour aux programmes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Données de test si pas d'exercices
  const testExercises: ExerciseWithDetails[] = [
    {
      id: 1,
      session_id: parseInt(id || '0'),
      exercise_id: 1,
      sets: 3,
      reps: 12,
      rest_time_sec: 60,
      order_index: 1,
      exercise: {
        id: 1,
        name: 'Développé couché',
        type: 'strength',
        muscle_group: 'Pectoraux',
      },
    },
    {
      id: 2,
      session_id: parseInt(id || '0'),
      exercise_id: 2,
      sets: 3,
      reps: 10,
      rest_time_sec: 90,
      order_index: 2,
      exercise: {
        id: 2,
        name: 'Squat',
        type: 'strength',
        muscle_group: 'Jambes',
      },
    },
    {
      id: 3,
      session_id: parseInt(id || '0'),
      exercise_id: 3,
      sets: 4,
      reps: 8,
      rest_time_sec: 60,
      order_index: 3,
      exercise: {
        id: 3,
        name: 'Tractions',
        type: 'strength',
        muscle_group: 'Dos',
      },
    },
  ];

  const displayExercises = exercises.length > 0 ? exercises : testExercises;
  const displayCurrentExercise = displayExercises[currentExerciseIndex];

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-fytli-cream flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mb-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-fytli-red to-fytli-orange flex items-center justify-center mx-auto mb-4">
              <Check className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Bien joué ! 🎉</h1>
            <p className="text-lg text-muted-foreground">
              Tu as terminé ta séance
            </p>
          </div>

          <Button
            onClick={handleFinishSession}
            className="btn-brand"
            size="lg"
          >
            Voir le résumé
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fytli-cream">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Quitter
          </button>
          <div className="text-center">
            <h2 className="font-bold text-fytli-dark">{session.title}</h2>
            <p className="text-sm text-muted-foreground">
              Exercice {currentExerciseIndex + 1}/{displayExercises.length}
            </p>
          </div>
          <div className="w-20" />
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-fytli-line">
          <motion.div
            className="h-full bg-gradient-to-r from-fytli-red to-fytli-orange"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentExerciseIndex + 1) / displayExercises.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          {isResting ? (
            <motion.div
              key="rest"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <div className="p-8 rounded-full bg-gradient-to-br from-fytli-orange/20 to-fytli-red/20 inline-block">
                <Timer className="h-16 w-16 text-fytli-red" />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-2">Temps de repos</h2>
                <div className="text-6xl font-bold text-gradient mb-4">
                  {restTimeLeft}s
                </div>
                <p className="text-muted-foreground">
                  Prochain : Série {currentSet}
                </p>
              </div>

              <Button
                onClick={handleSkipRest}
                variant="outline"
                size="lg"
              >
                Passer
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={`exercise-${currentExerciseIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              {/* Exercise Info */}
              <Card className="card-fytli">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <CardTitle className="text-3xl mb-2">
                        {displayCurrentExercise.exercise.name}
                      </CardTitle>
                      {displayCurrentExercise.exercise.muscle_group && (
                        <p className="text-muted-foreground">
                          {displayCurrentExercise.exercise.muscle_group}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-fytli-cream rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-fytli-red">
                        {currentSet}/{displayCurrentExercise.sets}
                      </div>
                      <div className="text-sm text-muted-foreground">Série</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-fytli-orange">
                        {displayCurrentExercise.reps}
                      </div>
                      <div className="text-sm text-muted-foreground">Reps</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-fytli-gray">
                        {displayCurrentExercise.rest_time_sec}s
                      </div>
                      <div className="text-sm text-muted-foreground">Repos</div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Action Button */}
              <Button
                onClick={handleSetComplete}
                className="btn-brand w-full"
                size="lg"
              >
                <Check className="h-6 w-6 mr-2" />
                Série terminée
              </Button>

              {/* Remaining exercises */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    À venir
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {displayExercises.slice(currentExerciseIndex + 1).map((ex) => (
                    <div
                      key={ex.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-fytli-cream"
                    >
                      <span className="font-medium">{ex.exercise.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {ex.sets} × {ex.reps}
                      </span>
                    </div>
                  ))}
                  {displayExercises.slice(currentExerciseIndex + 1).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      Dernier exercice ! 💪
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

