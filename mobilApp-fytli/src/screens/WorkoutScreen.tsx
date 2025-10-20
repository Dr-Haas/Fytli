import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, SHADOWS } from '@config/theme';
import Card from '@components/Card';
import GradientButton from '@components/GradientButton';
import FytliSun from '@components/FytliSun';
import { sessionsService } from '@/services';
import api from '@/services/api';
import { Session, SessionExercise, Exercise } from '@/types/database';

interface WorkoutScreenProps {
  navigation: any;
  route: any;
}

interface ExerciseWithDetails extends SessionExercise {
  exercise: Exercise;
}

// Types pour le mode circuit
type WorkoutMode = 'linear' | 'circuit';

interface ExerciseProgress {
  completedSets: number;
  totalSets: number;
}

const WorkoutScreen: React.FC<WorkoutScreenProps> = ({ navigation, route }) => {
  const { sessionId } = route.params;
  
  const [session, setSession] = useState<Session | null>(null);
  const [exercises, setExercises] = useState<ExerciseWithDetails[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  
  // États pour le mode circuit
  const [mode, setMode] = useState<WorkoutMode>('linear');
  const [exerciseProgress, setExerciseProgress] = useState<Map<number, ExerciseProgress>>(new Map());
  const [circuitExercises, setCircuitExercises] = useState<Set<number>>(new Set());
  const [isSelectingCircuit, setIsSelectingCircuit] = useState(false);

  useEffect(() => {
    fetchSessionData();
  }, [sessionId]);

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

  const fetchSessionData = async () => {
    try {
      const sessionData = await sessionsService.getById(sessionId);
      setSession(sessionData);
      
      // Récupérer les exercices de la session
      const response = await api.get(`/session-exercises?session_id=${sessionId}`);
      
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
            muscle_group: item.muscle_group,
          },
        }));
        setExercises(formattedExercises);
      } else {
        console.warn('⚠️ Aucun exercice trouvé pour cette session');
        setExercises([]);
      }
    } catch (error) {
      console.error('❌ Erreur chargement session:', error);
      Alert.alert('Erreur', 'Impossible de charger les exercices de cette session.');
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  // Helpers pour le mode circuit
  const getCurrentProgress = (exerciseId: number): ExerciseProgress => {
    const existing = exerciseProgress.get(exerciseId);
    if (existing) return existing;
    
    const exercise = exercises.find(ex => ex.exercise_id === exerciseId);
    return {
      completedSets: 0,
      totalSets: exercise?.sets || 3,
    };
  };

  const isExerciseComplete = (exerciseId: number): boolean => {
    const prog = getCurrentProgress(exerciseId);
    return prog.completedSets >= prog.totalSets;
  };

  const isWorkoutComplete = (): boolean => {
    return exercises.every(ex => isExerciseComplete(ex.exercise_id));
  };

  const currentExercise = exercises[currentExerciseIndex];

  const handleSetComplete = () => {
    if (!currentExercise) return;
    
    // Mettre à jour la progression
    const newProgress = new Map(exerciseProgress);
    const current = getCurrentProgress(currentExercise.exercise_id);
    newProgress.set(currentExercise.exercise_id, {
      ...current,
      completedSets: current.completedSets + 1,
    });
    setExerciseProgress(newProgress);

    // Mode circuit
    if (mode === 'circuit' && circuitExercises.size > 0) {
      const circuitList = exercises.filter(ex => circuitExercises.has(ex.exercise_id));
      const currentCircuitIndex = circuitList.findIndex(ex => ex.exercise_id === currentExercise.exercise_id);
      
      // Vérifier si c'est le dernier du circuit
      if (currentCircuitIndex === circuitList.length - 1) {
        // Circuit terminé ! Vérifier si tous les exercices du circuit ont toutes leurs séries
        const allCircuitComplete = circuitList.every(ex => {
          const prog = newProgress.get(ex.exercise_id);
          return prog && prog.completedSets >= prog.totalSets;
        });
        
        if (allCircuitComplete) {
          // Circuit totalement terminé
          setMode('linear');
          setCircuitExercises(new Set());
          Alert.alert('🎉 Circuit terminé !', 'Passage en mode linéaire');
          
          // Trouver le prochain exercice incomplet
          const nextIncompleteIndex = exercises.findIndex(
            (ex, idx) => idx > currentExerciseIndex && !isExerciseComplete(ex.exercise_id)
          );
          
          if (nextIncompleteIndex !== -1) {
            setCurrentExerciseIndex(nextIncompleteIndex);
            setCurrentSet(1);
            setIsResting(false);
          } else if (isWorkoutComplete()) {
            setIsCompleted(true);
          }
        } else {
          // Recommencer le circuit au début
          const firstCircuitIndex = exercises.findIndex(ex => circuitExercises.has(ex.exercise_id));
          setCurrentExerciseIndex(firstCircuitIndex);
          setCurrentSet(1);
          setRestTimeLeft(currentExercise.rest_time_sec);
          setIsResting(true);
        }
      } else {
        // Passer au prochain exercice du circuit
        const nextCircuitEx = circuitList[currentCircuitIndex + 1];
        const nextIndex = exercises.findIndex(ex => ex.exercise_id === nextCircuitEx.exercise_id);
        setCurrentExerciseIndex(nextIndex);
        setCurrentSet(1);
        setRestTimeLeft(currentExercise.rest_time_sec);
        setIsResting(true);
      }
    } else {
      // Mode linéaire : continuer sur le même exercice si des séries restent
      const updatedProg = newProgress.get(currentExercise.exercise_id);
      if (updatedProg && updatedProg.completedSets < updatedProg.totalSets) {
        setRestTimeLeft(currentExercise.rest_time_sec);
        setIsResting(true);
        setCurrentSet(currentSet + 1);
      } else {
        // Exercice terminé, passer au suivant
        if (currentExerciseIndex < exercises.length - 1) {
          setCurrentExerciseIndex(currentExerciseIndex + 1);
          setCurrentSet(1);
          setRestTimeLeft(currentExercise.rest_time_sec);
          setIsResting(true);
        } else {
          // Séance terminée
          setIsCompleted(true);
        }
      }
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setRestTimeLeft(0);
  };

  const toggleMode = () => {
    if (mode === 'linear') {
      // Passer en mode circuit : ouvrir la sélection
      setIsSelectingCircuit(true);
    } else {
      // Repasser en mode linéaire
      setMode('linear');
      setCircuitExercises(new Set());
      Alert.alert('📋 Mode Linéaire', 'Mode linéaire activé');
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
      Alert.alert('Erreur', 'Sélectionnez au moins 2 exercices pour un circuit');
      return;
    }

    setMode('circuit');
    setIsSelectingCircuit(false);
    
    // Commencer par le premier exercice du circuit
    const firstCircuitEx = exercises.find(ex => circuitExercises.has(ex.exercise_id));
    if (firstCircuitEx) {
      const firstIndex = exercises.findIndex(ex => ex.exercise_id === firstCircuitEx.exercise_id);
      setCurrentExerciseIndex(firstIndex);
      setCurrentSet(1);
    }
    
    Alert.alert('🔄 Circuit démarré', `Circuit avec ${circuitExercises.size} exercices !`);
  };

  const handleQuit = () => {
    Alert.alert(
      'Quitter la séance',
      'Es-tu sûr de vouloir quitter ? Ta progression ne sera pas enregistrée.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Quitter', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const handleFinishSession = () => {
    const duration = Math.round((Date.now() - startTime) / 1000 / 60); // en minutes
    navigation.navigate('SessionSummary', {
      session,
      exercises,
      duration,
      programId: session?.program_id,
    });
  };

  if (loading) {
    return (
      <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.orange} />
            <Text style={styles.loadingText}>Préparation de la séance...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!session || exercises.length === 0) {
    return (
      <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>😔</Text>
            <Text style={styles.errorTitle}>
              {!session ? 'Session introuvable' : 'Aucun exercice'}
            </Text>
            <Text style={styles.errorText}>
              {!session 
                ? 'Impossible de charger cette session d\'entraînement.' 
                : 'Cette session ne contient aucun exercice pour le moment.'}
            </Text>
            <GradientButton
              title="Retour"
              onPress={() => navigation.goBack()}
              size="medium"
              style={{ marginTop: SPACING.lg }}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Écran de complétion
  if (isCompleted) {
    return (
      <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.completionContainer}>
            <View style={styles.completionContent}>
              <LinearGradient colors={GRADIENTS.primary} style={styles.completionIcon}>
                <Text style={styles.completionCheckmark}>✓</Text>
              </LinearGradient>
              <Text style={styles.completionTitle}>Bien joué ! 🎉</Text>
              <Text style={styles.completionSubtitle}>Tu as terminé ta séance</Text>
            </View>
            <GradientButton
              title="Voir le résumé →"
              onPress={handleFinishSession}
              size="large"
              style={styles.summaryButton}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;

  return (
    <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleQuit} style={styles.quitButton}>
            <Text style={styles.quitText}>← Quitter</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.sessionTitle} numberOfLines={1}>{session.title}</Text>
            <Text style={styles.sessionProgress}>
              {currentExerciseIndex + 1}/{exercises.length}
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Mode Toggle Button */}
        {!isCompleted && !isResting && (
          <View style={styles.modeContainer}>
            <TouchableOpacity style={styles.modeButton} onPress={toggleMode}>
              <Text style={styles.modeIcon}>
                {mode === 'circuit' ? '⚡' : '📋'}
              </Text>
              <Text style={styles.modeText}>
                {mode === 'circuit' ? 'Circuit' : 'Linéaire'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Circuit Badge */}
        {mode === 'circuit' && circuitExercises.size > 0 && (
          <View style={styles.circuitBadge}>
            <Text style={styles.circuitBadgeText}>
              ⚡ MODE CIRCUIT ({circuitExercises.size} exercices)
            </Text>
          </View>
        )}

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {isResting ? (
            /* Rest Screen avec Soleil Fytli */
            <View style={styles.restContainer}>
              <View style={styles.restIconContainer}>
                <FytliSun
                  activityLevel={1 - (restTimeLeft / currentExercise.rest_time_sec)}
                  userCount={1}
                />
              </View>

              <Text style={styles.restTitle}>Temps de repos</Text>
              <Text style={styles.restTimer}>{restTimeLeft}s</Text>
              <Text style={styles.restSubtitle}>Prochain : Série {currentSet}</Text>

              <GradientButton
                title="Passer →"
                onPress={handleSkipRest}
                size="medium"
                style={styles.skipButton}
              />
            </View>
          ) : (
            /* Exercise Screen */
            <View style={styles.exerciseContainer}>
              {/* Exercise Info Card */}
              <Card style={styles.exerciseCard}>
                <Text style={styles.exerciseName}>{currentExercise.exercise.name}</Text>
                {currentExercise.exercise.muscle_group && (
                  <Text style={styles.exerciseMuscle}>{currentExercise.exercise.muscle_group}</Text>
                )}

                <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>
                      {currentSet}/{currentExercise.sets}
                    </Text>
                    <Text style={styles.statLabel}>Série</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{currentExercise.reps}</Text>
                    <Text style={styles.statLabel}>Reps</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{currentExercise.rest_time_sec}s</Text>
                    <Text style={styles.statLabel}>Repos</Text>
                  </View>
                </View>
              </Card>

              {/* Action Button */}
              <GradientButton
                title="✓ Série terminée"
                onPress={handleSetComplete}
                size="large"
                style={styles.completeButton}
              />

              {/* Remaining Exercises */}
              <Card style={styles.remainingCard}>
                <Text style={styles.remainingTitle}>À venir</Text>
                <View style={styles.remainingList}>
                  {exercises.slice(currentExerciseIndex + 1).map((ex) => (
                    <View key={ex.id} style={styles.remainingItem}>
                      <Text style={styles.remainingName}>{ex.exercise.name}</Text>
                      <Text style={styles.remainingInfo}>
                        {ex.sets} × {ex.reps}
                      </Text>
                    </View>
                  ))}
                  {exercises.slice(currentExerciseIndex + 1).length === 0 && (
                    <Text style={styles.lastExerciseText}>Dernier exercice ! 💪</Text>
                  )}
                </View>
              </Card>
            </View>
          )}
        </ScrollView>

        {/* Circuit Selection Modal */}
        {isSelectingCircuit && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Sélectionner les exercices</Text>
                <TouchableOpacity 
                  onPress={() => setIsSelectingCircuit(false)}
                  style={styles.modalClose}
                >
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll}>
                {exercises.map((exercise, index) => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={[
                      styles.exerciseSelectItem,
                      circuitExercises.has(exercise.exercise_id) && styles.exerciseSelectItemActive
                    ]}
                    onPress={() => toggleCircuitExercise(exercise.exercise_id)}
                  >
                    <View style={styles.exerciseSelectContent}>
                      <View style={styles.exerciseSelectNumber}>
                        <Text style={styles.exerciseSelectNumberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.exerciseSelectInfo}>
                        <Text style={styles.exerciseSelectName}>{exercise.exercise.name}</Text>
                        <Text style={styles.exerciseSelectMeta}>
                          {exercise.sets} séries × {exercise.reps || exercise.duration_seconds + 's'}
                        </Text>
                      </View>
                      {circuitExercises.has(exercise.exercise_id) && (
                        <Text style={styles.exerciseSelectCheck}>✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {circuitExercises.size > 0 && (
                <View style={styles.modalInfo}>
                  <Text style={styles.modalInfoText}>
                    ✅ {circuitExercises.size} exercice(s) sélectionné(s)
                  </Text>
                  <Text style={styles.modalInfoSubtext}>
                    Vous ferez 1 série de chaque, puis recommencerez.
                  </Text>
                </View>
              )}

              <View style={styles.modalFooter}>
                <GradientButton
                  title={`Démarrer le Circuit (${circuitExercises.size})`}
                  onPress={startCircuit}
                  disabled={circuitExercises.size < 2}
                  size="large"
                />
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 14,
    color: COLORS.darkGray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
    opacity: 0.5,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: SPACING.md,
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  quitButton: {
    padding: SPACING.xs,
  },
  quitText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.warmText,
  },
  sessionProgress: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  headerSpacer: {
    width: 60,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
  },
  progressBarTrack: {
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.orange,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
  // Rest Screen
  restContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  restIconContainer: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: SPACING.sm,
  },
  restTimer: {
    fontSize: 64,
    fontWeight: 'bold',
    color: COLORS.orange,
    marginBottom: SPACING.sm,
  },
  restSubtitle: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: SPACING.xl,
  },
  skipButton: {
    minWidth: 200,
  },
  // Exercise Screen
  exerciseContainer: {
    gap: SPACING.lg,
  },
  exerciseCard: {
    padding: SPACING.lg,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: SPACING.xs,
  },
  exerciseMuscle: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: SPACING.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    backgroundColor: COLORS.cream,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.orange,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  completeButton: {
    marginVertical: SPACING.sm,
  },
  remainingCard: {
    padding: SPACING.md,
  },
  remainingTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: SPACING.md,
  },
  remainingList: {
    gap: SPACING.sm,
  },
  remainingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.cream,
    borderRadius: BORDER_RADIUS.sm,
  },
  remainingName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.warmText,
  },
  remainingInfo: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  lastExerciseText: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.darkGray,
    paddingVertical: SPACING.sm,
  },
  // Completion Screen
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  completionContent: {
    alignItems: 'center',
    marginBottom: SPACING.xl * 2,
  },
  completionIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  completionCheckmark: {
    fontSize: 48,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  completionTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  completionSubtitle: {
    fontSize: 18,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  summaryButton: {
    width: '100%',
    maxWidth: 300,
  },
  // Mode Button
  modeContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
    alignSelf: 'flex-start',
  },
  modeIcon: {
    fontSize: 20,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.warmText,
  },
  // Circuit Badge
  circuitBadge: {
    backgroundColor: COLORS.orange,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
  },
  circuitBadgeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Modal
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    width: '100%',
    maxHeight: '80%',
    ...SHADOWS.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cream,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.warmText,
  },
  modalClose: {
    padding: SPACING.sm,
  },
  modalCloseText: {
    fontSize: 24,
    color: COLORS.darkGray,
  },
  modalScroll: {
    maxHeight: 400,
  },
  exerciseSelectItem: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cream,
  },
  exerciseSelectItemActive: {
    backgroundColor: COLORS.orange + '10',
  },
  exerciseSelectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  exerciseSelectNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.cream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseSelectNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.warmText,
  },
  exerciseSelectInfo: {
    flex: 1,
  },
  exerciseSelectName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.warmText,
    marginBottom: 4,
  },
  exerciseSelectMeta: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  exerciseSelectCheck: {
    fontSize: 24,
    color: COLORS.orange,
  },
  modalInfo: {
    padding: SPACING.lg,
    backgroundColor: COLORS.cream,
  },
  modalInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.warmText,
    marginBottom: 4,
  },
  modalInfoSubtext: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  modalFooter: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.cream,
  },
});

export default WorkoutScreen;
