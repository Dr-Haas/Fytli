import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, SHADOWS } from '@config/theme';
import Card from '@components/Card';
import GradientButton from '@components/GradientButton';
import ProgressBar from '@components/ProgressBar';
import { useAuth } from '@/contexts/AuthContext';
import { 
  enrollmentsService, 
  completionsService, 
  badgesService 
} from '@/services';
import { ProgramEnrollment, SessionCompletion, UserBadge } from '@/types/database';

interface DashboardScreenProps {
  navigation: any;
}

interface WeekDay {
  date: Date;
  dayName: string;
  isToday: boolean;
  completions: number;
}

interface Stats {
  activePrograms: number;
  sessionsThisWeek: number;
  badgesEarned: number;
  currentStreak: number;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  
  // State
  const [programs, setPrograms] = useState<ProgramEnrollment[]>([]);
  const [recentCompletions, setRecentCompletions] = useState<SessionCompletion[]>([]);
  const [recentBadges, setRecentBadges] = useState<UserBadge[]>([]);
  const [weekData, setWeekData] = useState<WeekDay[]>([]);
  const [stats, setStats] = useState<Stats>({
    activePrograms: 0,
    sessionsThisWeek: 0,
    badgesEarned: 0,
    currentStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) {
      console.log('⚠️ Dashboard - Pas d\'utilisateur connecté');
      return;
    }
    
    try {
      console.log('🔍 Dashboard - Chargement des données pour user:', user.id);
      
      // Fetch all data in parallel
      const [programsData, completionsData, badgesData] = await Promise.all([
        enrollmentsService.getUserEnrollments(user.id),
        completionsService.getByUser(user.id),
        badgesService.getUserEarnedBadges(user.id).catch(() => []),
      ]);

      console.log('📊 Dashboard - Données récupérées:', {
        programs: programsData.length,
        completions: completionsData.length,
        badges: badgesData.length
      });

      setPrograms(programsData.slice(0, 3)); // Top 3 programs
      
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
      console.error('❌ Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.orange} />
            <Text style={styles.loadingText}>Chargement du dashboard...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const statsData = [
    { icon: '💪', label: 'Programmes\nactifs', value: stats.activePrograms, color: GRADIENTS.blue },
    { icon: '✅', label: 'Sessions cette\nsemaine', value: stats.sessionsThisWeek, color: GRADIENTS.green },
    { icon: '🏆', label: 'Badges\ndébloqués', value: stats.badgesEarned, color: GRADIENTS.warm },
    { icon: '🔥', label: 'Série en\ncours', value: `${stats.currentStreak}j`, color: GRADIENTS.primary },
  ];

  return (
    <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>Bienvenue, {user?.firstname} ! 👋</Text>
            <Text style={styles.subtitle}>Voici ta synthèse d'entraînement</Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {statsData.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <LinearGradient colors={stat.color} style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>{stat.icon}</Text>
                </LinearGradient>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Week Calendar */}
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>📅</Text>
              <Text style={styles.cardTitle}>Ta semaine</Text>
            </View>
            <View style={styles.weekContainer}>
              {weekData.map((day, index) => (
                <View
                  key={index}
                  style={[
                    styles.dayCard,
                    day.isToday && styles.dayCardToday,
                    day.completions > 0 && !day.isToday && styles.dayCardCompleted,
                  ]}
                >
                  <Text style={[styles.dayName, day.isToday && styles.dayTextToday]}>
                    {day.dayName.substring(0, 2)}
                  </Text>
                  <Text style={[styles.dayNumber, day.isToday && styles.dayTextToday]}>
                    {day.date.getDate()}
                  </Text>
                  {day.completions > 0 ? (
                    <>
                      <Text style={[styles.checkIcon, day.isToday && styles.dayTextToday]}>✅</Text>
                      <Text style={[styles.dayCount, day.isToday && styles.dayTextToday]}>
                        {day.completions}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.emptyDot}>•</Text>
                  )}
                </View>
              ))}
            </View>
          </Card>

          {/* Active Programs */}
          <Card style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>💪</Text>
                <Text style={styles.cardTitle}>Mes programmes actifs</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Programs')}>
                <Text style={styles.seeAllText}>Voir tout →</Text>
              </TouchableOpacity>
            </View>
            {programs.length > 0 ? (
              <View style={styles.programsList}>
                {programs.map((program, index) => {
                  const progress = program.total_sessions > 0 
                    ? Math.round((program.sessions_completed / program.total_sessions) * 100)
                    : 0;

                  return (
                    <TouchableOpacity
                      key={program.id}
                      style={styles.programCard}
                      onPress={() => navigation.navigate('Programs', { programId: program.program_id })}
                    >
                      <View style={styles.programHeader}>
                        <Text style={styles.programTitle} numberOfLines={1}>{program.program_title}</Text>
                        <View style={[
                          styles.levelBadge,
                          program.program_level === 'beginner' && styles.levelBeginner,
                          program.program_level === 'intermediate' && styles.levelIntermediate,
                          program.program_level === 'advanced' && styles.levelAdvanced,
                        ]}>
                          <Text style={styles.levelText}>{program.program_level}</Text>
                        </View>
                      </View>
                      <ProgressBar progress={progress} height={8} style={styles.progressBar} />
                      <Text style={styles.programStats}>
                        {program.sessions_completed} / {program.total_sessions} séances complétées
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>💪</Text>
                <Text style={styles.emptyText}>Aucun programme actif</Text>
                <GradientButton
                  title="Explorer les programmes"
                  onPress={() => navigation.navigate('Programs')}
                  size="small"
                  style={styles.emptyButton}
                />
              </View>
            )}
          </Card>

          {/* Recent Badges */}
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🏆</Text>
              <Text style={styles.cardTitle}>Badges récents</Text>
            </View>
            {recentBadges.length > 0 ? (
              <View style={styles.badgesList}>
                {recentBadges.map((badge, index) => (
                  <View key={index} style={styles.badgeCard}>
                    <Text style={styles.badgeIcon}>{badge.icon}</Text>
                    <View style={styles.badgeInfo}>
                      <Text style={styles.badgeName}>{badge.name}</Text>
                      <Text style={styles.badgeDate}>
                        {new Date(badge.earned_at).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🏆</Text>
                <Text style={styles.emptyText}>Aucun badge débloqué</Text>
              </View>
            )}
          </Card>

          {/* Recent Activity */}
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>📈</Text>
              <Text style={styles.cardTitle}>Activité récente</Text>
            </View>
            {recentCompletions.length > 0 ? (
              <View style={styles.activityList}>
                {recentCompletions.map((completion, index) => (
                  <View key={completion.id} style={styles.activityCard}>
                    <Text style={styles.activityEmoji}>
                      {getFeelingEmoji(completion.feeling)}
                    </Text>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle} numberOfLines={1}>
                        {completion.session_title || 'Session'}
                      </Text>
                      <Text style={styles.activitySubtitle} numberOfLines={1}>
                        {completion.program_title}
                      </Text>
                    </View>
                    <Text style={styles.activityDate}>
                      {new Date(completion.completed_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📊</Text>
                <Text style={styles.emptyText}>Aucune activité récente</Text>
              </View>
            )}
          </Card>

          {/* Quick Action Card */}
          <LinearGradient colors={GRADIENTS.primary} style={styles.actionCard}>
            <Text style={styles.actionIcon}>🎯</Text>
            <Text style={styles.actionTitle}>Prêt pour une séance ?</Text>
            <Text style={styles.actionSubtitle}>
              Continue ta série de {stats.currentStreak} jour{stats.currentStreak > 1 ? 's' : ''} !
            </Text>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Programs')}>
              <Text style={styles.actionButtonText}>Commencer maintenant</Text>
            </TouchableOpacity>
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
  header: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: 14,
  },
  // Card components
  card: {
    marginBottom: SPACING.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardIcon: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.warmText,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.orange,
    fontWeight: '600',
  },
  // Week Calendar
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  dayCard: {
    flex: 1,
    backgroundColor: COLORS.cream,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayCardToday: {
    backgroundColor: COLORS.orange,
    borderWidth: 2,
    borderColor: COLORS.red,
  },
  dayCardCompleted: {
    backgroundColor: '#D1FAE5',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  dayName: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: 4,
  },
  dayTextToday: {
    color: COLORS.white,
  },
  checkIcon: {
    fontSize: 16,
  },
  dayCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10B981',
  },
  emptyDot: {
    fontSize: 20,
    color: '#D1D5DB',
  },
  // Programs
  programsList: {
    gap: SPACING.md,
  },
  programCard: {
    backgroundColor: COLORS.cream,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.warmText,
    flex: 1,
    marginRight: SPACING.sm,
  },
  levelBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  levelBeginner: {
    backgroundColor: '#D1FAE5',
  },
  levelIntermediate: {
    backgroundColor: '#DBEAFE',
  },
  levelAdvanced: {
    backgroundColor: '#FEE2E2',
  },
  levelText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.warmText,
  },
  progressBar: {
    marginVertical: SPACING.sm,
  },
  programStats: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  // Badges
  badgesList: {
    gap: SPACING.md,
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  badgeIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.warmText,
    marginBottom: 2,
  },
  badgeDate: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  // Activity
  activityList: {
    gap: SPACING.sm,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.white,
  },
  activityEmoji: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  activityInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.warmText,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  activityDate: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  // Action Card
  actionCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  actionSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.orange,
  },
  // Empty states
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: SPACING.md,
  },
  emptyButton: {
    marginTop: SPACING.sm,
  },
});

export default DashboardScreen;

