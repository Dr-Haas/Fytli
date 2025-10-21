import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@config/theme';
import Avatar from '@components/Avatar';
import Badge from '@components/Badge';
import ProgressBar from '@components/ProgressBar';
import Card from '@components/Card';
import { useAuth } from '@/contexts/AuthContext';
import { usersService, badgesService, bodyCompositionService } from '@/services';
import { UserBadge, BodyGoal } from '@/types/database';

interface ProfileScreenProps {
  navigation: any;
}

interface UserStats {
  total_sessions: number;
  total_duration_minutes: number;
  current_streak: number;
  longest_streak: number;
  total_programs: number;
  active_programs: number;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user: authUser, logout, isLoading: authLoading } = useAuth();
  
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [bodyGoals, setBodyGoals] = useState<BodyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('📱 ProfileScreen - authUser:', authUser);
    console.log('📱 ProfileScreen - authLoading:', authLoading);
    console.log('📱 ProfileScreen - authUser?.id:', authUser?.id);
    if (authUser?.id) {
      fetchProfileData();
    } else {
      console.log('⚠️ Pas d\'authUser disponible');
      setLoading(false);
    }
  }, [authUser]);

  const fetchProfileData = async () => {
    if (!authUser?.id) return;

    try {
      console.log('📊 Chargement des données profil pour userId:', authUser.id);
      
      const [userStats, userBadges, goals] = await Promise.all([
        usersService.getUserStats(authUser.id).catch((err) => {
          console.log('⚠️ Stats non disponibles:', err.message);
          return null;
        }),
        badgesService.getUserEarnedBadges(authUser.id).catch((err) => {
          console.log('⚠️ Badges non disponibles:', err.message);
          return [];
        }),
        bodyCompositionService.getGoals().catch((err) => {
          console.log('⚠️ Objectifs non disponibles:', err.message);
          return [];
        }),
      ]);

      console.log('✅ Données chargées - Stats:', userStats, 'Badges:', userBadges?.length, 'Goals:', goals?.length);

      setStats(userStats);
      setBadges(userBadges.slice(0, 4)); // Top 4 badges
      setBodyGoals(goals.filter((g: BodyGoal) => !g.is_achieved).slice(0, 3)); // Top 3 objectifs actifs
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileData();
  };

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const getGoalProgress = (goal: BodyGoal): number => {
    if (goal.target_value === 0) return 0;
    return Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
  };

  const getGoalLabel = (goalType: string): string => {
    const labels: { [key: string]: string } = {
      'weight_loss': 'Perte de poids',
      'muscle_gain': 'Gain musculaire',
      'body_fat_reduction': 'Réduction masse grasse',
      'measurement': 'Mensurations',
    };
    return labels[goalType] || goalType;
  };

  // Attendre que l'authentification se charge
  if (authLoading) {
    return (
      <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.orange} />
            <Text style={styles.loadingText}>Chargement du profil...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!authUser) {
    const checkAsyncStorage = async () => {
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');
        
        console.log('🔍 Debug AsyncStorage:');
        console.log('Token présent:', !!token);
        console.log('User présent:', !!user);
        if (user) {
          console.log('User data:', JSON.parse(user));
        }
        
        Alert.alert(
          'Debug Info',
          `Token: ${!!token}\nUser: ${!!user}\n\nVoir console pour détails`
        );
      } catch (error) {
        console.error('Erreur debug:', error);
        Alert.alert('Erreur', String(error));
      }
    };

    return (
      <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>😕</Text>
            <Text style={styles.errorTitle}>Profil non trouvé</Text>
            <Text style={styles.errorText}>
              Impossible de charger les informations du profil.{'\n'}
              L'utilisateur n'est pas disponible dans le contexte.
            </Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => navigation.navigate('Debug')}
            >
              <Text style={styles.retryButtonText}>🔍 Voir le Debug complet</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.retryButton, { marginTop: SPACING.sm, backgroundColor: '#8B5CF6' }]} 
              onPress={checkAsyncStorage}
            >
              <Text style={styles.retryButtonText}>📦 Check Storage</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.retryButton, { marginTop: SPACING.sm, backgroundColor: COLORS.darkGray }]} 
              onPress={() => navigation.navigate('Main')}
            >
              <Text style={styles.retryButtonText}>🏠 Retour à l'accueil</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.retryButton, { marginTop: SPACING.sm, backgroundColor: COLORS.red }]} 
              onPress={handleLogout}
            >
              <Text style={styles.retryButtonText}>🚪 Se déconnecter</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const user = {
    name: `${authUser.firstname} ${authUser.lastname}`,
    email: authUser.email,
    avatar: authUser.avatar_url,
  };

  return (
    <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.orange} />
          }
        >
          {/* Header avec Avatar */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[COLORS.orange, COLORS.red]}
                style={styles.avatarGlow}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.avatarInner}>
                  <Avatar name={user.name} imageUrl={user.avatar} size="xlarge" />
                </View>
              </LinearGradient>
            </View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>

            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Modifier mes infos</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.orange} />
              <Text style={styles.loadingText}>Chargement...</Text>
            </View>
          ) : (
            <>
              {/* Statistiques */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mes statistiques</Text>
                <View style={styles.statsGrid}>
                  <Card style={styles.statCard}>
                    <Text style={styles.statIcon}>🔥</Text>
                    <Text style={styles.statValue}>
                      {stats?.current_streak || 0} {stats?.current_streak === 1 ? 'jour' : 'jours'}
                    </Text>
                    <Text style={styles.statLabel}>Streak actuel</Text>
                  </Card>
                  <Card style={styles.statCard}>
                    <Text style={styles.statIcon}>💪</Text>
                    <Text style={styles.statValue}>{stats?.total_sessions || 0}</Text>
                    <Text style={styles.statLabel}>Total séances</Text>
                  </Card>
                  <Card style={styles.statCard}>
                    <Text style={styles.statIcon}>⏱️</Text>
                    <Text style={styles.statValue}>
                      {stats ? formatDuration(stats.total_duration_minutes) : '0h 0min'}
                    </Text>
                    <Text style={styles.statLabel}>Temps total</Text>
                  </Card>
                </View>
              </View>

              {/* Badges débloqués */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Badges débloqués</Text>
                  {badges.length > 4 && (
                    <TouchableOpacity onPress={() => navigation.navigate('Badges')}>
                      <Text style={styles.seeAllText}>Voir tout →</Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                {badges.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.badgesScroll}
                  >
                    {badges.map((badge, index) => (
                      <View key={badge.id || index} style={styles.badgeItem}>
                        <Badge
                          icon={badge.icon || '🏆'}
                          label={badge.name || 'Badge'}
                          color={COLORS.orange}
                          size="medium"
                        />
                      </View>
                    ))}
                  </ScrollView>
                ) : (
                  <Card style={styles.emptyCard}>
                    <Text style={styles.emptyIcon}>🏆</Text>
                    <Text style={styles.emptyText}>Aucun badge débloqué pour le moment</Text>
                    <Text style={styles.emptySubtext}>Continue à t'entraîner pour en gagner !</Text>
                  </Card>
                )}
              </View>

              {/* Objectifs corporels */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Objectifs corporels</Text>
                  {bodyGoals.length > 0 && (
                    <TouchableOpacity onPress={() => navigation.navigate('BodyGoals')}>
                      <Text style={styles.seeAllText}>Voir tout →</Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                {bodyGoals.length > 0 ? (
                  <Card style={styles.goalsCard}>
                    {bodyGoals.map((goal, index) => (
                      <View key={goal.id || index} style={styles.goalItem}>
                        <ProgressBar
                          progress={getGoalProgress(goal)}
                          label={getGoalLabel(goal.goal_type)}
                          showPercentage
                        />
                      </View>
                    ))}
                  </Card>
                ) : (
                  <Card style={styles.emptyCard}>
                    <Text style={styles.emptyIcon}>🎯</Text>
                    <Text style={styles.emptyText}>Aucun objectif défini</Text>
                    <Text style={styles.emptySubtext}>Fixe-toi des objectifs pour suivre ta progression !</Text>
                  </Card>
                )}
              </View>
            </>
          )}

          {/* Actions */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>⚙️ Paramètres</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>🔔 Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>❓ Aide & Support</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={[styles.actionButtonText, styles.logoutText]}>
                🚪 Déconnexion
              </Text>
            </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    paddingVertical: SPACING.xl * 2,
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
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  retryButton: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.sm,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  avatarGlow: {
    padding: 4,
    borderRadius: 64,
  },
  avatarInner: {
    backgroundColor: COLORS.white,
    borderRadius: 60,
    padding: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: SPACING.md,
  },
  editButton: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    marginTop: SPACING.sm,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.warmText,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.orange,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: 2,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  badgesScroll: {
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  badgeItem: {
    marginRight: SPACING.md,
  },
  goalsCard: {
    padding: SPACING.md,
  },
  goalItem: {
    marginBottom: SPACING.md,
  },
  emptyCard: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.warmText,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  actionButtonText: {
    fontSize: 16,
    color: COLORS.warmText,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: SPACING.md,
  },
  logoutText: {
    color: COLORS.red,
  },
});

export default ProfileScreen;
