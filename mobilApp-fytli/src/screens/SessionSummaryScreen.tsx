import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, SHADOWS } from '@config/theme';
import Card from '@components/Card';
import GradientButton from '@components/GradientButton';
import { completionsService } from '@/services';
import { Session } from '@/types/database';

interface SessionSummaryScreenProps {
  navigation: any;
  route: any;
}

type FeelingType = 'terrible' | 'bad' | 'okay' | 'good' | 'excellent';

const SessionSummaryScreen: React.FC<SessionSummaryScreenProps> = ({ navigation, route }) => {
  const { session, exercises, duration, programId } = route.params || {};
  
  const [notes, setNotes] = useState('');
  const [feeling, setFeeling] = useState<FeelingType>('good');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  // Sauvegarder automatiquement la completion au chargement
  useEffect(() => {
    if (session && programId && !saved) {
      saveCompletion();
    }
  }, [session?.id, programId, saved]);

  const saveCompletion = async () => {
    if (!session || !programId || saved) return;
    
    setSaving(true);
    try {
      const completion = await completionsService.create({
        program_id: programId,
        session_id: session.id,
        duration_minutes: duration,
        notes: notes || undefined,
        feeling: feeling,
      });

      setSaved(true);
      console.log('✅ Completion enregistrée:', completion);
      
      // TODO: Déverrouiller le feed social
      // const feedResult = await unlockFeed(completion.id, ...);
      // setStreakCount(feedResult.streak);
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde completion:', error);
      Alert.alert('Erreur', 'Impossible d\'enregistrer la séance');
    } finally {
      setSaving(false);
    }
  };

  const getFeelingEmoji = (feelingValue: string) => {
    const emojiMap: { [key: string]: string } = {
      'terrible': '😖',
      'bad': '😞',
      'okay': '😐',
      'good': '😊',
      'excellent': '🤩',
    };
    return emojiMap[feelingValue] || '💪';
  };

  if (!session) {
    return (
      <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Aucune donnée de séance</Text>
            <GradientButton
              title="Retour"
              onPress={() => navigation.navigate('Main')}
              size="small"
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const feelingOptions = [
    { value: 'terrible', label: 'Terrible', icon: '😖', color: styles.feelingTerrible },
    { value: 'bad', label: 'Difficile', icon: '😞', color: styles.feelingBad },
    { value: 'okay', label: 'Ok', icon: '😐', color: styles.feelingOkay },
    { value: 'good', label: 'Bien', icon: '😊', color: styles.feelingGood },
    { value: 'excellent', label: 'Excellent', icon: '🤩', color: styles.feelingExcellent },
  ];

  const totalSets = exercises?.reduce((acc: number, ex: any) => acc + ex.sets, 0) || 0;

  return (
    <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Hero Section */}
          <LinearGradient colors={GRADIENTS.primary} style={styles.heroSection}>
            <View style={styles.heroIcon}>
              <View style={styles.heroIconInner}>
                <Text style={styles.heroIconText}>🏆</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>Séance terminée ! 🎉</Text>
            <Text style={styles.heroSubtitle}>{session.title}</Text>
          </LinearGradient>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⏱️</Text>
              <Text style={styles.statValue}>{duration || 25} min</Text>
              <Text style={styles.statLabel}>Durée</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⚡</Text>
              <Text style={styles.statValue}>{exercises?.length || 0}</Text>
              <Text style={styles.statLabel}>Exercices</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🏆</Text>
              <Text style={styles.statValue}>{totalSets}</Text>
              <Text style={styles.statLabel}>Séries</Text>
            </View>
          </View>

          {/* Feeling Selector */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Comment tu te sens ? 💭</Text>
            <View style={styles.feelingGrid}>
              {feelingOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setFeeling(option.value as FeelingType)}
                  style={[
                    styles.feelingButton,
                    feeling === option.value && [styles.feelingButtonActive, option.color]
                  ]}
                >
                  <Text style={styles.feelingIcon}>{option.icon}</Text>
                  <Text style={styles.feelingLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Notes */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Notes personnelles</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Comment s'est passée ta séance ? Des progrès ?"
              placeholderTextColor={COLORS.darkGray}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </Card>

          {/* AI Comments */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Analyse de ta séance</Text>
            
            <Card style={[styles.commentCard, styles.commentGreen]}>
              <View style={styles.commentHeader}>
                <View style={[styles.commentIconBg, styles.commentIconGreen]}>
                  <Text style={styles.commentIcon}>📈</Text>
                </View>
                <View style={styles.commentContent}>
                  <Text style={styles.commentTitle}>Belle régularité</Text>
                  <Text style={styles.commentText}>
                    Tu maintiens un bon rythme, continue comme ça ! 💪
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={[styles.commentCard, styles.commentOrange]}>
              <View style={styles.commentHeader}>
                <View style={[styles.commentIconBg, styles.commentIconOrange]}>
                  <Text style={styles.commentIcon}>⚡</Text>
                </View>
                <View style={styles.commentContent}>
                  <Text style={styles.commentTitle}>Intensité solide</Text>
                  <Text style={styles.commentText}>
                    Tes temps de repos sont bien gérés, parfait pour la progression.
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={[styles.commentCard, styles.commentBlue]}>
              <View style={styles.commentHeader}>
                <View style={[styles.commentIconBg, styles.commentIconBlue]}>
                  <Text style={styles.commentIcon}>💬</Text>
                </View>
                <View style={styles.commentContent}>
                  <Text style={styles.commentTitle}>Conseil du jour</Text>
                  <Text style={styles.commentText}>
                    Pense à bien t'hydrater après cette séance. 💧
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Exercises Completed */}
          {exercises && exercises.length > 0 && (
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Exercices réalisés</Text>
              <View style={styles.exercisesList}>
                {exercises.map((ex: any, index: number) => (
                  <View key={ex.id} style={styles.exerciseItem}>
                    <View style={styles.exerciseNumber}>
                      <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.exerciseName}>{ex.exercise.name}</Text>
                    <Text style={styles.exerciseStats}>
                      {ex.sets} × {ex.reps}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          )}

          {/* Motivation Quote */}
          <Card style={styles.motivationCard}>
            <Text style={styles.motivationText}>
              "Le plus dur, c'est de commencer. Et tu l'as fait ! 🔥"
            </Text>
            <Text style={styles.motivationSubtext}>
              À bientôt pour la prochaine séance
            </Text>
          </Card>

          {/* Actions */}
          <View style={styles.actions}>
            <GradientButton
              title="🏠 Retour au Dashboard"
              onPress={() => navigation.navigate('Main')}
              size="large"
              style={styles.actionButton}
            />
            
            {programId && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('ProgramDetail', { programId })}
              >
                <Text style={styles.secondaryButtonText}>Voir le programme</Text>
              </TouchableOpacity>
            )}
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.darkGray,
    marginBottom: SPACING.lg,
  },
  // Hero Section
  heroSection: {
    paddingVertical: SPACING.xl * 2,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  heroIconInner: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIconText: {
    fontSize: 40,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  // Stats
  statsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginTop: -SPACING.xl,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.darkGray,
  },
  // Cards
  card: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: SPACING.md,
  },
  // Feeling
  feelingGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  feelingButton: {
    flex: 1,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  feelingButtonActive: {
    borderColor: 'currentColor',
  },
  feelingTerrible: {
    backgroundColor: '#FEE2E2',
  },
  feelingBad: {
    backgroundColor: '#FED7AA',
  },
  feelingOkay: {
    backgroundColor: '#FEF3C7',
  },
  feelingGood: {
    backgroundColor: '#D1FAE5',
  },
  feelingExcellent: {
    backgroundColor: '#FFE4E1',
  },
  feelingIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  feelingLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.warmText,
  },
  // Notes
  notesInput: {
    backgroundColor: COLORS.cream,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: 14,
    color: COLORS.warmText,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  // Comments
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: SPACING.md,
  },
  commentCard: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  commentGreen: {
    borderTopWidth: 3,
    borderTopColor: '#10B981',
  },
  commentOrange: {
    borderTopWidth: 3,
    borderTopColor: COLORS.orange,
  },
  commentBlue: {
    borderTopWidth: 3,
    borderTopColor: '#3B82F6',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  commentIconBg: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentIconGreen: {
    backgroundColor: '#D1FAE5',
  },
  commentIconOrange: {
    backgroundColor: '#FFEDD5',
  },
  commentIconBlue: {
    backgroundColor: '#DBEAFE',
  },
  commentIcon: {
    fontSize: 20,
  },
  commentContent: {
    flex: 1,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  // Exercises
  exercisesList: {
    gap: SPACING.sm,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.cream,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.md,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  exerciseName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.warmText,
  },
  exerciseStats: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  // Motivation
  motivationCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: '#FFE4E1',
  },
  motivationText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.warmText,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  motivationSubtext: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  // Actions
  actions: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  actionButton: {
    marginBottom: SPACING.sm,
  },
  secondaryButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.orange,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.orange,
  },
});

export default SessionSummaryScreen;

