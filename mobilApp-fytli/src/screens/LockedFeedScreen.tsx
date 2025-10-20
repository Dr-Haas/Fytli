import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '@config/theme';
import GradientButton from '@components/GradientButton';

interface LockedFeedScreenProps {
  navigation: any;
}

const LockedFeedScreen: React.FC<LockedFeedScreenProps> = ({ navigation }) => {
  const handleStartWorkout = () => {
    navigation.navigate('Workout');
  };

  return (
    <LinearGradient
      colors={[COLORS.cream, COLORS.white]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Cercle Fytli grisé */}
          <View style={styles.circleContainer}>
            <View style={styles.circle}>
              <View style={styles.lockIconContainer}>
                <Text style={styles.lockIcon}>🔒</Text>
              </View>
            </View>
          </View>

          {/* Message principal */}
          <View style={styles.messageContainer}>
            <Text style={styles.mainMessage}>
              Bouge pour rallumer ton cercle 🔒
            </Text>
            <Text style={styles.subMessage}>
              Chaque séance te connecte à ton équipe.
            </Text>
          </View>

          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <View style={styles.illustrationItem}>
              <Text style={styles.illustrationEmoji}>💪</Text>
              <Text style={styles.illustrationText}>Entraîne-toi</Text>
            </View>
            <Text style={styles.illustrationArrow}>→</Text>
            <View style={styles.illustrationItem}>
              <Text style={styles.illustrationEmoji}>🔓</Text>
              <Text style={styles.illustrationText}>Déverrouille</Text>
            </View>
            <Text style={styles.illustrationArrow}>→</Text>
            <View style={styles.illustrationItem}>
              <Text style={styles.illustrationEmoji}>🔥</Text>
              <Text style={styles.illustrationText}>Partage</Text>
            </View>
          </View>

          {/* Motivation */}
          <View style={styles.motivationContainer}>
            <Text style={styles.motivationText}>
              Tes amis ont bougé aujourd'hui.{'\n'}
              À ton tour ! 💫
            </Text>
          </View>

          {/* CTA */}
          <View style={styles.ctaContainer}>
            <GradientButton
              title="Faire ma séance"
              onPress={handleStartWorkout}
              size="large"
            />
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
    paddingVertical: SPACING.xl,
    justifyContent: 'space-between',
  },
  circleContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  lockIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 48,
  },
  messageContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  mainMessage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.warmText,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 36,
  },
  subMessage: {
    fontSize: 18,
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: 26,
  },
  illustrationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
  },
  illustrationItem: {
    alignItems: 'center',
    flex: 1,
  },
  illustrationEmoji: {
    fontSize: 40,
    marginBottom: SPACING.xs,
  },
  illustrationText: {
    fontSize: 12,
    color: COLORS.darkGray,
    fontWeight: '600',
    textAlign: 'center',
  },
  illustrationArrow: {
    fontSize: 24,
    color: COLORS.orange,
    marginHorizontal: SPACING.xs,
  },
  motivationContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  motivationText: {
    fontSize: 16,
    color: COLORS.warmText,
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaContainer: {
    paddingBottom: SPACING.lg,
  },
});

export default LockedFeedScreen;

