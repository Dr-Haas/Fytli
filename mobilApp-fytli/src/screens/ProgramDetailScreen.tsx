import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, SHADOWS } from '@config/theme';
import Card from '@components/Card';
import GradientButton from '@components/GradientButton';
import { programsService, sessionsService, enrollmentsService, completionsService } from '@/services';
import { Program, Session, ProgramEnrollment, SessionCompletion, ProgramStats } from '@/types/database';

interface ProgramDetailScreenProps {
  navigation: any;
  route: any;
}

const ProgramDetailScreen: React.FC<ProgramDetailScreenProps> = ({ navigation, route }) => {
  const { programId } = route.params;
  
  const [program, setProgram] = useState<Program | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [enrolledUsers, setEnrolledUsers] = useState<ProgramEnrollment[]>([]);
  const [activityFeed, setActivityFeed] = useState<SessionCompletion[]>([]);
  const [stats, setStats] = useState<ProgramStats | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchProgramData();
  }, [programId]);

  const fetchProgramData = async () => {
    try {
      const [
        programData,
        sessionsData,
        usersData,
        feedData,
        statsData,
        enrollmentStatus
      ] = await Promise.all([
        programsService.getById(programId),
        sessionsService.getByProgramId(programId),
        enrollmentsService.getUsersByProgram(programId),
        completionsService.getProgramActivityFeed(programId, 10),
        enrollmentsService.getProgramStats(programId),
        enrollmentsService.checkEnrollment(programId).catch(() => false)
      ]);
      
      setProgram(programData);
      setSessions(sessionsData);
      setEnrolledUsers(usersData);
      setActivityFeed(feedData);
      setStats(statsData);
      setIsEnrolled(enrollmentStatus);
    } catch (error) {
      console.error('❌ Erreur lors du chargement du programme:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await enrollmentsService.enroll(programId);
      setIsEnrolled(true);
      Alert.alert('Succès', 'Inscription réussie ! 🎉');
      
      // Rafraîchir les données
      const [usersData, statsData] = await Promise.all([
        enrollmentsService.getUsersByProgram(programId),
        enrollmentsService.getProgramStats(programId),
      ]);
      setEnrolledUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error('❌ Erreur inscription:', error);
      Alert.alert('Erreur', 'Impossible de s\'inscrire au programme');
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    Alert.alert(
      'Désinscription',
      'Êtes-vous sûr de vouloir vous désinscrire ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'destructive',
          onPress: async () => {
            setEnrolling(true);
            try {
              await enrollmentsService.unenroll(programId);
              setIsEnrolled(false);
              Alert.alert('Désinscription', 'Désinscription effectuée');
              
              // Rafraîchir les données
              const [usersData, statsData] = await Promise.all([
                enrollmentsService.getUsersByProgram(programId),
                enrollmentsService.getProgramStats(programId),
              ]);
              setEnrolledUsers(usersData);
              setStats(statsData);
            } catch (error) {
              console.error('❌ Erreur désinscription:', error);
              Alert.alert('Erreur', 'Impossible de se désinscrire');
            } finally {
              setEnrolling(false);
            }
          },
        },
      ]
    );
  };

  const handleStartSession = (sessionId: number) => {
    navigation.navigate('Workout', { sessionId });
  };

  const getLevelLabel = (level?: string) => {
    switch (level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return 'Non défini';
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'beginner': return styles.levelBeginner;
      case 'intermediate': return styles.levelIntermediate;
      case 'advanced': return styles.levelAdvanced;
      default: return styles.levelDefault;
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.orange} />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!program) {
    return (
      <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Programme introuvable</Text>
            <GradientButton
              title="Retour"
              onPress={() => navigation.goBack()}
              size="small"
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Program Header */}
          <Card style={styles.headerCard}>
            <View style={styles.headerContent}>
              <Text style={styles.programTitle}>{program.title}</Text>
              {program.level && (
                <View style={[styles.levelBadge, getLevelColor(program.level)]}>
                  <Text style={styles.levelText}>{getLevelLabel(program.level)}</Text>
                </View>
              )}
            </View>

            {program.description && (
              <Text style={styles.programDescription}>{program.description}</Text>
            )}

            {program.goal && (
              <View style={styles.goalContainer}>
                <Text style={styles.goalIcon}>🎯</Text>
                <Text style={styles.goalText}>{program.goal}</Text>
              </View>
            )}

            {/* Stats */}
            <View style={styles.statsContainer}>
              {program.duration_weeks && (
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>⏱️</Text>
                  <Text style={styles.statText}>{program.duration_weeks} sem.</Text>
                </View>
              )}
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>💪</Text>
                <Text style={styles.statText}>{sessions.length} session(s)</Text>
              </View>
              {stats && (
                <>
                  <View style={styles.statItem}>
                    <Text style={styles.statIcon}>👥</Text>
                    <Text style={styles.statText}>{stats.active_users} part.</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statIcon}>📈</Text>
                    <Text style={styles.statText}>{stats.total_completions} complétées</Text>
                  </View>
                </>
              )}
            </View>

            {/* Enroll Button */}
            <GradientButton
              title={isEnrolled ? "Se désinscrire" : "Rejoindre le programme"}
              onPress={isEnrolled ? handleUnenroll : handleEnroll}
              loading={enrolling}
              disabled={enrolling}
              size="large"
              style={styles.enrollButton}
            />
          </Card>

          {/* Sessions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sessions d'entraînement</Text>
            
            {sessions.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Text style={styles.emptyText}>Aucune session disponible</Text>
              </Card>
            ) : (
              <View style={styles.sessionsList}>
                {sessions.map((session, index) => (
                  <Card key={session.id} style={styles.sessionCard}>
                    <View style={styles.sessionHeader}>
                      <View style={styles.sessionNumberContainer}>
                        <LinearGradient colors={GRADIENTS.primary} style={styles.sessionNumber}>
                          <Text style={styles.sessionNumberText}>
                            {session.order_index || session.order || session.day_number || index + 1}
                          </Text>
                        </LinearGradient>
                      </View>
                      <View style={styles.sessionInfo}>
                        <Text style={styles.sessionTitle}>{session.title}</Text>
                        {session.notes && (
                          <Text style={styles.sessionNotes} numberOfLines={2}>
                            {session.notes}
                          </Text>
                        )}
                      </View>
                    </View>
                    <GradientButton
                      title="Let's Go! 🚀"
                      onPress={() => handleStartSession(session.id)}
                      size="medium"
                      style={styles.sessionButton}
                    />
                  </Card>
                ))}
              </View>
            )}
          </View>

          {/* Participants */}
          {enrolledUsers.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Participants ({enrolledUsers.length})</Text>
              <Card>
                <View style={styles.participantsList}>
                  {enrolledUsers.slice(0, 5).map((enrollment) => (
                    <TouchableOpacity
                      key={enrollment.id}
                      style={styles.participantItem}
                      onPress={() => navigation.navigate('FriendProfile', { userId: enrollment.user_id })}
                    >
                      <View style={styles.participantAvatar}>
                        <Text style={styles.participantAvatarText}>
                          {enrollment.first_name?.[0]}{enrollment.last_name?.[0]}
                        </Text>
                      </View>
                      <View style={styles.participantInfo}>
                        <Text style={styles.participantName}>
                          {enrollment.first_name} {enrollment.last_name}
                        </Text>
                        <Text style={styles.participantSessions}>
                          {enrollment.sessions_completed || 0} sessions
                        </Text>
                      </View>
                      <Text style={styles.participantIcon}>🏆</Text>
                    </TouchableOpacity>
                  ))}
                  {enrolledUsers.length > 5 && (
                    <Text style={styles.moreParticipants}>
                      +{enrolledUsers.length - 5} autres participants
                    </Text>
                  )}
                </View>
              </Card>
            </View>
          )}

          {/* Activity Feed */}
          {activityFeed.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Activité récente</Text>
              <Card>
                <View style={styles.activityList}>
                  {activityFeed.slice(0, 5).map((completion) => (
                    <View key={completion.id} style={styles.activityItem}>
                      <View style={styles.activityAvatar}>
                        <Text style={styles.activityAvatarText}>
                          {completion.first_name?.[0]}{completion.last_name?.[0]}
                        </Text>
                      </View>
                      <View style={styles.activityInfo}>
                        <Text style={styles.activityText}>
                          <Text style={styles.activityName}>{completion.first_name}</Text> a terminé{' '}
                          <Text style={styles.activitySession}>{completion.session_title}</Text>
                        </Text>
                        <Text style={styles.activityDate}>
                          {new Date(completion.completed_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </Card>
            </View>
          )}

          {/* Motivation Card */}
          <LinearGradient colors={GRADIENTS.warm} style={styles.motivationCard}>
            <Text style={styles.motivationIcon}>⚡</Text>
            <Text style={styles.motivationTitle}>Prêt(e) à bouger ? 💪</Text>
            <Text style={styles.motivationSubtitle}>
              20 minutes suffisent pour faire la différence.
            </Text>
          </LinearGradient>
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
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
  errorText: {
    fontSize: 18,
    color: COLORS.darkGray,
    marginBottom: SPACING.lg,
  },
  headerCard: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  programTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.warmText,
    flex: 1,
    marginRight: SPACING.md,
  },
  levelBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  levelBeginner: {
    backgroundColor: '#D1FAE5',
  },
  levelIntermediate: {
    backgroundColor: '#DBEAFE',
  },
  levelAdvanced: {
    backgroundColor: '#FCE7F3',
  },
  levelDefault: {
    backgroundColor: '#F3F4F6',
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.warmText,
  },
  programDescription: {
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
  },
  goalIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  goalText: {
    fontSize: 13,
    color: COLORS.warmText,
    fontWeight: '500',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginBottom: SPACING.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statIcon: {
    fontSize: 14,
  },
  statText: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  enrollButton: {
    marginTop: SPACING.sm,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: SPACING.md,
  },
  emptyCard: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  sessionsList: {
    gap: SPACING.md,
  },
  sessionCard: {
    marginBottom: SPACING.md,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sessionNumberContainer: {
    marginRight: SPACING.md,
  },
  sessionNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionNumberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: 2,
  },
  sessionNotes: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  sessionButton: {
    marginTop: SPACING.xs,
  },
  participantsList: {
    gap: SPACING.sm,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.cream,
    borderRadius: BORDER_RADIUS.md,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  participantAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.warmText,
  },
  participantSessions: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  participantIcon: {
    fontSize: 18,
  },
  moreParticipants: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.darkGray,
    paddingTop: SPACING.sm,
  },
  activityList: {
    gap: SPACING.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.sm,
    backgroundColor: COLORS.cream,
    borderRadius: BORDER_RADIUS.md,
  },
  activityAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  activityAvatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    fontSize: 13,
    color: COLORS.warmText,
    marginBottom: 2,
  },
  activityName: {
    fontWeight: '600',
  },
  activitySession: {
    fontWeight: '600',
  },
  activityDate: {
    fontSize: 11,
    color: COLORS.darkGray,
  },
  motivationCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  motivationIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  motivationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  motivationSubtitle: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
});

export default ProgramDetailScreen;

