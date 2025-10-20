import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@config/theme';
import Avatar from '@components/Avatar';
import Card from '@components/Card';
import { socialService } from '@/services';
import { SocialFeedItem } from '@/types/database';

interface FeedScreenProps {
  navigation: any;
}

const FeedScreen: React.FC<FeedScreenProps> = ({ navigation }) => {
  const [feedItems, setFeedItems] = useState<SocialFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const feed = await socialService.getFeed();
      setFeedItems(feed);
    } catch (error) {
      console.error('❌ Erreur chargement feed:', error);
      // En cas d'erreur, on garde les données existantes ou un tableau vide
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeed();
  };

  const getItemEmoji = (type: string): string => {
    const emojis = {
      completion: '✅',
      badge: '🏆',
      program_enrollment: '💪',
      goal_achieved: '🎯',
    };
    return emojis[type as keyof typeof emojis] || '🔥';
  };

  const formatTimestamp = (createdAt: string): string => {
    const now = new Date();
    const date = new Date(createdAt);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.orange} />
            <Text style={styles.loadingText}>Chargement du feed...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[COLORS.cream, COLORS.white]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Ton Cercle Fytli s'est réveillé 🔥</Text>
        </View>

        {/* Feed */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.orange} />
          }
        >
          {feedItems.length > 0 ? (
            feedItems.map((item) => {
              const userName = `${item.firstname || ''} ${item.lastname || ''}`.trim() || 'Utilisateur';
              
              return (
                <View key={item.id} style={styles.feedCard}>
                  <View style={styles.cardHeader}>
                    <Avatar name={userName} imageUrl={item.avatar_url} size="small" />
                    <View style={styles.cardHeaderText}>
                      <Text style={styles.userName}>{userName}</Text>
                      <Text style={styles.timestamp}>{formatTimestamp(item.created_at)}</Text>
                    </View>
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={styles.contentText}>
                      <Text style={styles.userNameInline}>{userName}</Text> {item.content}
                    </Text>
                    <Text style={styles.emoji}>{getItemEmoji(item.type)}</Text>
                  </View>

                  {item.type === 'completion' && (
                    <View style={styles.cardFooter}>
                      <Text style={styles.moodText}>💪 Continue comme ça !</Text>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📢</Text>
              <Text style={styles.emptyTitle}>Aucune activité</Text>
              <Text style={styles.emptyText}>
                Ton cercle est calme pour le moment.{'\n'}
                Suis d'autres utilisateurs pour voir leur activité !
              </Text>
            </Card>
          )}

          {/* Daily motivation card */}
          <Card style={styles.motivationCard}>
            <View style={styles.motivationHeader}>
              <Text style={styles.motivationIcon}>✨</Text>
              <Text style={styles.motivationTitle}>Motivation du jour</Text>
            </View>
            <Text style={styles.motivationQuote}>
              "Le mouvement, c'est la vie. Chaque session compte."
            </Text>
          </Card>
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
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.warmText,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  feedCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  cardHeaderText: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.warmText,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginTop: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  contentText: {
    fontSize: 14,
    color: COLORS.warmText,
    flex: 1,
    lineHeight: 20,
  },
  userNameInline: {
    fontWeight: '600',
  },
  emoji: {
    fontSize: 32,
    marginLeft: SPACING.sm,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: SPACING.sm,
    marginTop: SPACING.sm,
  },
  moodText: {
    fontSize: 12,
    color: COLORS.darkGray,
    fontStyle: 'italic',
  },
  emptyCard: {
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.warmText,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: 22,
  },
  motivationCard: {
    backgroundColor: COLORS.cream,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.orange + '30',
  },
  motivationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  motivationIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  motivationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.warmText,
  },
  motivationQuote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.darkGray,
    lineHeight: 22,
  },
});

export default FeedScreen;
