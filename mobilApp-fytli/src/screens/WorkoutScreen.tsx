import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, SHADOWS } from '@config/theme';
import Card from '@components/Card';
import GradientButton from '@components/GradientButton';
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

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {isResting ? (
            /* Rest Screen */
            <View style={styles.restContainer}>
              <View style={styles.restIconContainer}>
                <LinearGradient colors={['#FFA34A40', '#FF794840']} style={styles.restIconBg}>
                  <Text style={styles.restIcon}>⏱️</Text>
                </LinearGradient>
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
  },
  restIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restIcon: {
    fontSize: 48,
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
});

export default WorkoutScreen;
