import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { sessionsService } from '../services/sessions';
import { Session, SessionExercise, Exercise } from '../types';
import { 
  ArrowLeft, Check, ChevronRight, Timer, GripVertical, 
  RotateCcw, ListOrdered, Zap
} from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';
import { showToast, getErrorMessage } from '../utils/toast';
import api from '../services/api';
import toast from 'react-hot-toast';

interface ExerciseWithDetails extends SessionExercise {
  exercise: Exercise;
}

interface ExerciseProgress {
  exerciseId: number;
  completedSets: number;
  totalSets: number;
}

type WorkoutMode = 'linear' | 'circuit';

export const SessionWorkoutFlexible = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [exercises, setExercises] = useState<ExerciseWithDetails[]>([]);
  const [workoutOrder, setWorkoutOrder] = useState<ExerciseWithDetails[]>([]);
  const [mode, setMode] = useState<WorkoutMode>('linear');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<Map<number, ExerciseProgress>>(new Map());
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [isReordering, setIsReordering] = useState(false);
  const [circuitExercises, setCircuitExercises] = useState<Set<number>>(new Set());
  const [isSelectingCircuit, setIsSelectingCircuit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const sessionData = await sessionsService.getById(parseInt(id));
        setSession(sessionData);
        
        const response = await api.get(`/session-exercises?session_id=${id}`);
        
        if (response.data.success && response.data.data.length > 0) {
          const formattedExercises: ExerciseWithDetails[] = response.data.data.map((item: any) => ({
            id: item.id,
            session_id: item.session_id,
            exercise_id: item.exercise_id,
            sets: item.sets || 3,
            reps: item.reps || 0,
            duration_seconds: item.duration_seconds || 0,
            rest_time_sec: item.rest_sec || item.rest_seconds || 60,
            order_index: item.order_index || item.order || 0,
            exercise: {
              id: item.exercise_id,
              name: item.exercise_name || 'Exercice',
              type: 'strength',
            },
          }));
          
          setExercises(formattedExercises);
          setWorkoutOrder(formattedExercises);
          
          // Initialiser les progrès
          const initialProgress = new Map<number, ExerciseProgress>();
          formattedExercises.forEach(ex => {
            initialProgress.set(ex.exercise_id, {
              exerciseId: ex.exercise_id,
              completedSets: 0,
              totalSets: ex.sets,
            });
          });
          setProgress(initialProgress);
        }
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

  const currentExercise = workoutOrder[currentIndex];

  const getCurrentProgress = (exerciseId: number): ExerciseProgress => {
    return progress.get(exerciseId) || { exerciseId, completedSets: 0, totalSets: 0 };
  };

  const isExerciseComplete = (exerciseId: number): boolean => {
    const prog = getCurrentProgress(exerciseId);
    return prog.completedSets >= prog.totalSets;
  };

  const isWorkoutComplete = (): boolean => {
    return Array.from(progress.values()).every(p => p.completedSets >= p.totalSets);
  };

  const handleSetComplete = () => {
    if (!currentExercise) return;

    // Marquer la série comme complétée
    const newProgress = new Map(progress);
    const currentProg = getCurrentProgress(currentExercise.exercise_id);
    
    newProgress.set(currentExercise.exercise_id, {
      ...currentProg,
      completedSets: Math.min(currentProg.completedSets + 1, currentProg.totalSets),
    });
    
    setProgress(newProgress);

    // Vérifier si tout est terminé
    const allComplete = Array.from(newProgress.values()).every(p => p.completedSets >= p.totalSets);
    if (allComplete) {
      setIsCompleted(true);
      return;
    }

    // Trouver le prochain exercice selon le mode
    if (mode === 'circuit' && circuitExercises.size > 0) {
      // Mode circuit avec sélection
      const circuitList = workoutOrder.filter(ex => circuitExercises.has(ex.exercise_id));
      const currentCircuitIndex = circuitList.findIndex(ex => ex.id === currentExercise.id);
      
      // Vérifier si c'est le dernier du circuit
      if (currentCircuitIndex === circuitList.length - 1) {
        // Circuit terminé ! Vérifier si tous les exercices du circuit ont toutes leurs séries
        const allCircuitComplete = circuitList.every(ex => {
          const prog = getCurrentProgress(ex.exercise_id);
          return prog.completedSets >= prog.totalSets;
        });
        
        if (allCircuitComplete) {
          // Circuit totalement terminé, repasser en mode linéaire
          setMode('linear');
          setCircuitExercises(new Set());
          toast.success('🎉 Circuit terminé ! Passage en mode linéaire');
          
          // Trouver le prochain exercice incomplet
          const nextIncompleteIndex = workoutOrder.findIndex(
            (ex, idx) => idx > currentIndex && !isExerciseComplete(ex.exercise_id)
          );
          
          if (nextIncompleteIndex !== -1) {
            setCurrentIndex(nextIncompleteIndex);
            setIsResting(false);
          }
        } else {
          // Recommencer le circuit au début
          const firstCircuitIndex = workoutOrder.findIndex(ex => circuitExercises.has(ex.exercise_id));
          setCurrentIndex(firstCircuitIndex);
          setRestTimeLeft(currentExercise.rest_time_sec);
          setIsResting(true);
        }
      } else {
        // Passer au prochain exercice du circuit
        const nextCircuitEx = circuitList[currentCircuitIndex + 1];
        const nextIndex = workoutOrder.findIndex(ex => ex.id === nextCircuitEx.id);
        setCurrentIndex(nextIndex);
        setRestTimeLeft(currentExercise.rest_time_sec);
        setIsResting(true);
      }
    } else {
      // Mode linéaire : continuer sur le même exercice si des séries restent
      if (currentProg.completedSets + 1 < currentProg.totalSets) {
        setRestTimeLeft(currentExercise.rest_time_sec);
        setIsResting(true);
      } else {
        // Exercice terminé, passer au suivant
        const nextIncompleteIndex = workoutOrder.findIndex(
          (ex, idx) => idx > currentIndex && !isExerciseComplete(ex.exercise_id)
        );
        
        if (nextIncompleteIndex !== -1) {
          setCurrentIndex(nextIncompleteIndex);
          setIsResting(false);
        }
      }
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setRestTimeLeft(0);
  };

  const handleSkipExercise = () => {
    if (!currentExercise) return;
    
    // Marquer l'exercice comme complet
    const newProgress = new Map(progress);
    const currentProg = getCurrentProgress(currentExercise.exercise_id);
    newProgress.set(currentExercise.exercise_id, {
      ...currentProg,
      completedSets: currentProg.totalSets,
    });
    setProgress(newProgress);

    // Passer au prochain incomplet
    const nextIndex = workoutOrder.findIndex(
      (ex, idx) => idx > currentIndex && !isExerciseComplete(ex.exercise_id)
    );
    
    if (nextIndex !== -1) {
      setCurrentIndex(nextIndex);
      setIsResting(false);
    } else if (isWorkoutComplete()) {
      setIsCompleted(true);
    }
  };

  const toggleMode = () => {
    if (mode === 'linear') {
      // Passer en mode circuit : ouvrir la sélection
      setIsSelectingCircuit(true);
    } else {
      // Repasser en mode linéaire
      setMode('linear');
      setCircuitExercises(new Set());
      toast.success('📋 Mode Linéaire activé');
    }
  };

  const toggleCircuitExercise = (exerciseId: number) => {
    const newCircuit = new Set(circuitExercises);
    if (newCircuit.has(exerciseId)) {
      newCircuit.delete(exerciseId);
    } else {
      newCircuit.add(exerciseId);
    }
    setCircuitExercises(newCircuit);
  };

  const startCircuit = () => {
    if (circuitExercises.size < 2) {
      toast.error('Sélectionnez au moins 2 exercices pour un circuit');
      return;
    }

    setMode('circuit');
    setIsSelectingCircuit(false);
    
    // Commencer par le premier exercice du circuit
    const firstCircuitEx = workoutOrder.find(ex => circuitExercises.has(ex.exercise_id));
    if (firstCircuitEx) {
      const firstIndex = workoutOrder.findIndex(ex => ex.id === firstCircuitEx.id);
      setCurrentIndex(firstIndex);
    }
    
    toast.success(`🔄 Circuit démarré avec ${circuitExercises.size} exercices !`);
  };

  const resetWorkoutOrder = () => {
    setWorkoutOrder([...exercises]);
    setCurrentIndex(0);
    showToast.success('Ordre réinitialisé');
  };

  const handleFinishSession = () => {
    const duration = Math.round((Date.now() - startTime) / 1000 / 60);
    navigate('/session-summary', {
      state: {
        session,
        exercises,
        duration,
        programId: session?.program_id,
      },
    });
  };

  const getTotalProgress = (): number => {
    const totalSets = Array.from(progress.values()).reduce((sum, p) => sum + p.totalSets, 0);
    const completedSets = Array.from(progress.values()).reduce((sum, p) => sum + p.completedSets, 0);
    return totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-fytli-cream flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session || workoutOrder.length === 0) {
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

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-fytli-cream flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center w-full max-w-md"
        >
          <div className="mb-6 lg:mb-8">
            <div className="h-20 w-20 lg:h-24 lg:w-24 rounded-full bg-gradient-to-br from-fytli-red to-fytli-orange flex items-center justify-center mx-auto mb-4">
              <Check className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gradient mb-2">Bien joué ! 🎉</h1>
            <p className="text-base lg:text-lg text-muted-foreground">
              Tu as terminé ta séance
            </p>
          </div>

          <Button
            onClick={handleFinishSession}
            className="btn-brand w-full"
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
    <div className="min-h-screen bg-fytli-cream pb-20">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Quitter</span>
          </button>
          
          <div className="text-center flex-1 px-2">
            <h2 className="font-bold text-sm text-fytli-dark truncate">{session.title}</h2>
            <p className="text-xs text-muted-foreground">
              {Math.round(getTotalProgress())}% complété
            </p>
          </div>

          <button
            onClick={toggleMode}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              mode === 'circuit'
                ? 'bg-fytli-orange text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {mode === 'circuit' ? <Zap className="h-3 w-3" /> : <ListOrdered className="h-3 w-3" />}
            {mode === 'circuit' ? 'Circuit' : 'Linéaire'}
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-fytli-line">
          <motion.div
            className="h-full bg-gradient-to-r from-fytli-red to-fytli-orange"
            animate={{ width: `${getTotalProgress()}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-4 max-w-2xl">
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
                  Prochain : {workoutOrder[(currentIndex + 1) % workoutOrder.length]?.exercise.name || 'Exercice suivant'}
                </p>
              </div>

              <Button
                onClick={handleSkipRest}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Passer
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={`exercise-${currentIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-4"
            >
              {/* Exercise Info */}
              <Card className="card-fytli">
                <CardHeader className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <CardTitle className="text-3xl mb-2">
                        {currentExercise.exercise.name}
                      </CardTitle>
                      {currentExercise.exercise.muscle_group && (
                        <p className="text-muted-foreground">
                          {currentExercise.exercise.muscle_group}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-fytli-cream rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-fytli-red">
                        {getCurrentProgress(currentExercise.exercise_id).completedSets + 1}/
                        {currentExercise.sets}
                      </div>
                      <div className="text-sm text-muted-foreground">Série</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-fytli-orange">
                        {currentExercise.reps}
                      </div>
                      <div className="text-sm text-muted-foreground">Reps</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-fytli-gray">
                        {currentExercise.rest_time_sec}s
                      </div>
                      <div className="text-sm text-muted-foreground">Repos</div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handleSetComplete}
                  className="btn-brand w-full"
                  size="lg"
                >
                  <Check className="h-6 w-6 mr-2" />
                  Série terminée
                </Button>
                
                <Button
                  onClick={handleSkipExercise}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Passer cet exercice
                </Button>
              </div>

              {/* Exercise List with Reorder */}
              <Card>
                <CardHeader className="p-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {isReordering ? 'Réorganiser les exercices' : 'Progrès'}
                  </CardTitle>
                  <div className="flex gap-2">
                    {isReordering && (
                      <button
                        onClick={resetWorkoutOrder}
                        className="text-xs text-fytli-orange hover:text-fytli-red transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Réinitialiser
                      </button>
                    )}
                    <button
                      onClick={() => setIsReordering(!isReordering)}
                      className="text-xs text-fytli-orange hover:text-fytli-red transition-colors"
                    >
                      {isReordering ? '✓ Terminé' : '✏️ Modifier'}
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  {isReordering ? (
                    <Reorder.Group values={workoutOrder} onReorder={setWorkoutOrder}>
                      {workoutOrder.map((ex) => {
                        const prog = getCurrentProgress(ex.exercise_id);
                        const isComplete = prog.completedSets >= prog.totalSets;
                        
                        return (
                          <Reorder.Item key={ex.id} value={ex}>
                            <div
                              className={`flex items-center gap-3 p-3 rounded-lg mb-2 cursor-grab active:cursor-grabbing ${
                                isComplete ? 'bg-green-50' : 'bg-fytli-cream'
                              }`}
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                              <div className="flex-1">
                                <span className={`font-medium ${isComplete ? 'line-through text-muted-foreground' : ''}`}>
                                  {ex.exercise.name}
                                </span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {prog.completedSets}/{ex.sets}
                              </span>
                            </div>
                          </Reorder.Item>
                        );
                      })}
                    </Reorder.Group>
                  ) : (
                    <>
                      {workoutOrder.map((ex) => {
                        const prog = getCurrentProgress(ex.exercise_id);
                        const isComplete = prog.completedSets >= prog.totalSets;
                        const isCurrent = ex.id === currentExercise.id;
                        
                        return (
                          <div
                            key={ex.id}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                              isCurrent
                                ? 'bg-fytli-orange/20 border-2 border-fytli-orange'
                                : isComplete
                                ? 'bg-green-50'
                                : 'bg-fytli-cream'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isComplete && <Check className="h-4 w-4 text-green-600" />}
                              <span className={`font-medium text-sm ${isComplete ? 'text-green-700' : ''}`}>
                                {ex.exercise.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {prog.completedSets}/{ex.sets}
                              </span>
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-fytli-red to-fytli-orange transition-all"
                                  style={{ width: `${(prog.completedSets / ex.sets) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Mode Info */}
              <Card className="bg-fytli-orange/10 border-fytli-orange/30">
                <CardContent className="p-4">
                  <p className="text-sm text-center">
                    {mode === 'circuit' ? (
                      <>
                        <Zap className="h-4 w-4 inline mr-1" />
                        <strong>Mode Circuit :</strong> Faites 1 série de chaque exercice puis recommencez
                      </>
                    ) : (
                      <>
                        <ListOrdered className="h-4 w-4 inline mr-1" />
                        <strong>Mode Linéaire :</strong> Terminez toutes les séries avant de passer au suivant
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal de sélection du circuit */}
      {isSelectingCircuit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🔄 Créer un Circuit
              </h2>
              <p className="text-sm text-gray-600">
                Sélectionnez les exercices à inclure dans votre circuit
              </p>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <div className="space-y-2">
                {workoutOrder.map((ex) => {
                  const isSelected = circuitExercises.has(ex.exercise_id);
                  const prog = getCurrentProgress(ex.exercise_id);
                  const isComplete = prog.completedSets >= prog.totalSets;

                  if (isComplete) return null; // Ne pas montrer les exercices déjà terminés

                  return (
                    <button
                      key={ex.id}
                      onClick={() => toggleCircuitExercise(ex.exercise_id)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-fytli-orange bg-fytli-orange/10'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-fytli-orange bg-fytli-orange'
                              : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <Check className="h-4 w-4 text-white" />}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{ex.exercise.name}</p>
                          <p className="text-sm text-gray-500">
                            {prog.completedSets}/{ex.sets} séries • {ex.reps} reps
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {circuitExercises.size > 0 && (
                <div className="mt-4 p-4 bg-fytli-orange/10 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    ✅ {circuitExercises.size} exercice(s) sélectionné(s)
                  </p>
                  <p className="text-xs text-gray-600">
                    Vous ferez 1 série de chaque, puis recommencerez jusqu'à épuisement.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 space-y-3">
              <Button
                onClick={startCircuit}
                disabled={circuitExercises.size < 2}
                className="btn-brand w-full"
                size="lg"
              >
                <Zap className="h-5 w-5 mr-2" />
                Démarrer le Circuit
              </Button>
              <Button
                onClick={() => {
                  setIsSelectingCircuit(false);
                  setCircuitExercises(new Set());
                }}
                variant="outline"
                className="w-full"
              >
                Annuler
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SessionWorkoutFlexible;

