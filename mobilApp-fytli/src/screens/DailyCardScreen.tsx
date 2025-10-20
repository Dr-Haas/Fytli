import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS } from '@config/theme';
import Avatar from '@components/Avatar';
import Badge from '@components/Badge';

interface DailyCardScreenProps {
  navigation: any;
}

const DailyCardScreen: React.FC<DailyCardScreenProps> = ({ navigation }) => {
  const userName = 'Marie';
  const streak = 12;
  const todayBadge = { icon: '🔥', label: 'Warrior' };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `+1 dans ma série ! 🔥 ${streak} jours avec Fytli - Bouge mieux, vis mieux.`,
      });
    } catch (error) {
      console.error('Erreur de partage:', error);
    }
  };

  return (
    <LinearGradient colors={GRADIENTS.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Header */}
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {/* Card Content */}
          <View style={styles.card}>
            <View style={styles.avatarContainer}>
              <Avatar name={userName} size="xlarge" showGlow />
            </View>

            <Text style={styles.mainText}>+1 dans ta série 🔥</Text>

            <View style={styles.streakContainer}>
              <Text style={styles.streakNumber}>{streak}</Text>
              <Text style={styles.streakLabel}>jours de suite</Text>
            </View>

            <View style={styles.badgeContainer}>
              <Text style={styles.badgeTitle}>Badge du jour</Text>
              <Badge icon={todayBadge.icon} label={todayBadge.label} size="large" />
            </View>

            <View style={styles.decorations}>
              <Text style={styles.decoration}>✨</Text>
              <Text style={styles.decoration}>💪</Text>
              <Text style={styles.decoration}>✨</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)']}
                style={styles.shareButtonGradient}
              >
                <Text style={styles.shareButtonText}>📸 Partager sur Insta / Snap</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.footerText}>Fytli — Bouge mieux, vis mieux.</Text>
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  avatarContainer: {
    marginBottom: SPACING.xl,
  },
  mainText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  streakNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    color: COLORS.white,
    lineHeight: 80,
  },
  streakLabel: {
    fontSize: 20,
    color: COLORS.white,
    opacity: 0.9,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  badgeTitle: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: SPACING.md,
    opacity: 0.9,
  },
  decorations: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginTop: SPACING.lg,
  },
  decoration: {
    fontSize: 32,
  },
  footer: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  shareButton: {
    width: '100%',
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  shareButtonGradient: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.orange,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'center',
  },
});

export default DailyCardScreen;

