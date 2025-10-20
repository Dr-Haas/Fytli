import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@config/theme';
import Avatar from '@components/Avatar';
import Badge from '@components/Badge';
import Card from '@components/Card';
import { socialService } from '@/services';

interface FriendProfileScreenProps {
  navigation: any;
  route: {
    params: {
      userId: number;
    };
  };
}

const FriendProfileScreen: React.FC<FriendProfileScreenProps> = ({ navigation, route }) => {
  const { userId } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'accepted'>('none');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await socialService.getPublicProfile(userId);
      setProfile(data);
      setIsConnected(data.isConnected);
      setConnectionStatus(data.connectionStatus || 'none');
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
      Alert.alert('Erreur', 'Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    setActionLoading(true);
    try {
      await socialService.addFriend(userId);
      setConnectionStatus('pending');
      Alert.alert('Succès', 'Demande d\'ami envoyée !');
    } catch (error: any) {
      console.error('❌ Erreur ajout ami:', error);
      Alert.alert('Erreur', error.response?.data?.message || 'Impossible d\'ajouter cet ami');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptFriend = async () => {
    setActionLoading(true);
    try {
      await socialService.acceptFriend(userId);
      setConnectionStatus('accepted');
      setIsConnected(true);
      Alert.alert('Succès', 'Demande acceptée !');
    } catch (error) {
      console.error('❌ Erreur acceptation:', error);
      Alert.alert('Erreur', 'Impossible d\'accepter la demande');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    Alert.alert(
      'Supprimer la connexion',
      'Êtes-vous sûr de vouloir supprimer cette connexion ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              await socialService.removeFriend(userId);
              setConnectionStatus('none');
              setIsConnected(false);
              Alert.alert('Succès', 'Connexion supprimée');
            } catch (error) {
              console.error('❌ Erreur suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer la connexion');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
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

  if (!profile) {
    return (
      <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Profil non trouvé</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const { user, stats, badges, recentActivity } = profile;

  const displayStats = [
    { label: 'Streak', value: stats.current_streak || 0, icon: '🔥' },
    { label: 'Séances totales', value: stats.total_sessions || 0, icon: '💪' },
    { label: 'Badges', value: stats.total_badges || 0, icon: '🏆' },
  ];

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} jour${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''}`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Header avec Avatar */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButtonTop} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[COLORS.orange, COLORS.red]}
                style={styles.avatarGlow}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.avatarInner}>
                  <Avatar 
                    name={`${user.first_name || ''} ${user.last_name || ''}`} 
                    imageUrl={user.avatar_url} 
                    size="xlarge" 
                  />
                </View>
              </LinearGradient>
            </View>

            <Text style={styles.name}>
              {user.first_name} {user.last_name}
            </Text>
            {user.email && <Text style={styles.email}>{user.email}</Text>}

            {/* Boutons de connexion conditionnels */}
            {connectionStatus === 'none' && (
              <TouchableOpacity
                style={styles.followButton}
                onPress={handleAddFriend}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.followButtonText}>+ Ajouter comme ami</Text>
                )}
              </TouchableOpacity>
            )}

            {connectionStatus === 'pending' && (
              <View style={styles.pendingContainer}>
                <Text style={styles.pendingText}>⏳ En attente</Text>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={handleAcceptFriend}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Text style={styles.acceptButtonText}>✓ Accepter</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {connectionStatus === 'accepted' && (
              <View style={styles.connectedContainer}>
                <View style={styles.connectedBadge}>
                  <Text style={styles.connectedText}>✓ Connecté</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={handleRemoveFriend}
                  disabled={actionLoading}
                >
                  <Text style={styles.removeButtonText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Message motivant */}
          <View style={styles.motivationContainer}>
            <Text style={styles.motivationText}>
              Fytli te connecte à l'énergie des autres 💪
            </Text>
          </View>

          {/* Statistiques visibles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistiques</Text>
            <View style={styles.statsGrid}>
              {displayStats.map((stat, index) => (
                <Card key={index} style={styles.statCard}>
                  <Text style={styles.statIcon}>{stat.icon}</Text>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </Card>
              ))}
            </View>
          </View>

          {/* Badges publics */}
          {badges && badges.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Badges débloqués</Text>
              <View style={styles.badgesContainer}>
                {badges.slice(0, 3).map((badge, index) => (
                  <View key={badge.id || index} style={styles.badgeItem}>
                    <Badge
                      icon={badge.icon || '🏆'}
                      label={badge.name || 'Badge'}
                      color={COLORS.orange}
                      size="medium"
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Activité récente */}
          {recentActivity && recentActivity.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Activité récente</Text>
              <Card style={styles.activityCard}>
                {recentActivity.slice(0, 3).map((activity, index) => (
                  <View key={activity.id || index} style={styles.activityItem}>
                    <Text style={styles.activityIcon}>{activity.emoji || '💪'}</Text>
                    <Text style={styles.activityText}>{activity.message}</Text>
                    <Text style={styles.activityTime}>
                      {formatTimeAgo(activity.created_at)}
                    </Text>
                  </View>
                ))}
              </Card>
            </View>
          )}

          {/* État verrouillé si pas d'activité */}
          {(!recentActivity || recentActivity.length === 0) && (
            <View style={styles.section}>
              <Card style={styles.emptyCard}>
                <Text style={styles.emptyIcon}>🔒</Text>
                <Text style={styles.emptyText}>Activité privée</Text>
                <Text style={styles.emptySubtext}>
                  Les activités de cet utilisateur ne sont pas visibles pour le moment
                </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: SPACING.lg,
    left: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.warmText,
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
    marginBottom: SPACING.md,
  },
  followButton: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.md,
  },
  followingButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.orange,
  },
  followButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  followingButtonText: {
    color: COLORS.orange,
  },
  motivationContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  motivationText: {
    fontSize: 16,
    color: COLORS.orange,
    textAlign: 'center',
    fontWeight: '600',
  },
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
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  programCard: {
    padding: SPACING.md,
  },
  programName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.warmText,
    marginBottom: SPACING.xs,
  },
  programTime: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  badgeItem: {
    flex: 1,
    alignItems: 'center',
  },
  activityCard: {
    padding: SPACING.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.warmText,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
});

export default FriendProfileScreen;

