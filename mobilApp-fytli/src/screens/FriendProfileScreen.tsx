import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@config/theme';
import Avatar from '@components/Avatar';
import Badge from '@components/Badge';
import Card from '@components/Card';

interface FriendProfileScreenProps {
  navigation: any;
  route?: any;
}

const FriendProfileScreen: React.FC<FriendProfileScreenProps> = ({ navigation, route }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const friend = {
    name: 'Sophie Martin',
    avatar: undefined,
  };

  const stats = [
    { label: 'Streak', value: '18', icon: '🔥' },
    { label: 'Séances totales', value: '124', icon: '💪' },
    { label: 'Badges', value: '15', icon: '🏆' },
  ];

  const publicBadges = [
    { icon: '🔥', label: 'Fire Starter', color: COLORS.red },
    { icon: '💎', label: 'Precious', color: COLORS.orange },
    { icon: '⭐', label: 'Star', color: COLORS.yellow },
  ];

  const recentProgram = {
    name: 'Programme Force & Endurance',
    lastSession: 'Il y a 2h',
  };

  return (
    <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Header avec Avatar */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
                  <Avatar name={friend.name} imageUrl={friend.avatar} size="xlarge" />
                </View>
              </LinearGradient>
            </View>

            <Text style={styles.name}>{friend.name}</Text>

            <TouchableOpacity
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                {isFollowing ? '✓ Suivi' : '+ Suivre'}
              </Text>
            </TouchableOpacity>
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
              {stats.map((stat, index) => (
                <Card key={index} style={styles.statCard}>
                  <Text style={styles.statIcon}>{stat.icon}</Text>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </Card>
              ))}
            </View>
          </View>

          {/* Dernier programme */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dernier programme</Text>
            <Card style={styles.programCard}>
              <Text style={styles.programName}>{recentProgram.name}</Text>
              <Text style={styles.programTime}>{recentProgram.lastSession}</Text>
            </Card>
          </View>

          {/* Badges publics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Badges publics</Text>
            <View style={styles.badgesContainer}>
              {publicBadges.map((badge, index) => (
                <View key={index} style={styles.badgeItem}>
                  <Badge
                    icon={badge.icon}
                    label={badge.label}
                    color={badge.color}
                    size="medium"
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Activité récente */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activité récente</Text>
            <Card style={styles.activityCard}>
              <View style={styles.activityItem}>
                <Text style={styles.activityIcon}>🌅</Text>
                <Text style={styles.activityText}>
                  A terminé sa routine matinale
                </Text>
                <Text style={styles.activityTime}>Il y a 2h</Text>
              </View>
              <View style={styles.activityItem}>
                <Text style={styles.activityIcon}>🔥</Text>
                <Text style={styles.activityText}>
                  18 jours de suite !
                </Text>
                <Text style={styles.activityTime}>Il y a 1 jour</Text>
              </View>
            </Card>
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

