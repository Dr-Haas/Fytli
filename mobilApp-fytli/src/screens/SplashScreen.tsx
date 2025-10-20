import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, GRADIENTS, SPACING } from '@config/theme';
import GradientButton from '@components/GradientButton';

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={GRADIENTS.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.logo}>fytli</Text>
            <View style={styles.illustrationContainer}>
              <Text style={styles.illustration}>💪</Text>
              <Text style={styles.illustration}>🤝</Text>
              <Text style={styles.illustration}>✨</Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
            <Text style={styles.tagline}>Seul, mais ensemble.</Text>
            <Text style={styles.subtitle}>
              Bouge, connecte-toi, fais briller ton cercle.
            </Text>
          </Animated.View>

          <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
            <GradientButton
              title="Commencer"
              onPress={() => navigation.navigate('Login')}
              size="large"
            />
          </Animated.View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING['2xl'],
    paddingHorizontal: SPACING.lg,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 64,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 2,
    marginBottom: SPACING.xl,
  },
  illustrationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  illustration: {
    fontSize: 48,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  tagline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
  },
});

export default SplashScreen;

