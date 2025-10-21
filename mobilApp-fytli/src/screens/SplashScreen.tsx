import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, GRADIENTS, SPACING } from '@config/theme';
import GradientButton from '@components/GradientButton';
import FytliSun from '@components/FytliSun';

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const [activityLevel, setActivityLevel] = useState(0);
  const [userCount, setUserCount] = useState(1);

  useEffect(() => {
    // Animation du fade et scale
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

    // Animation progressive du soleil (chargement)
    const activityTimer = setInterval(() => {
      setActivityLevel(prev => {
        const next = prev + 0.1;
        return next > 1 ? 1 : next;
      });
    }, 200);

    // Ajout progressif d'utilisateurs
    const userTimer = setInterval(() => {
      setUserCount(prev => (prev < 5 ? prev + 1 : prev));
    }, 600);

    return () => {
      clearInterval(activityTimer);
      clearInterval(userTimer);
    };
  }, []);

  return (
    <LinearGradient colors={['#D94A28', '#E65C35', '#F26B42']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo et header */}
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
            
            {/* Soleil Fytli comme animation de chargement */}
            <View style={styles.sunLoadingContainer}>
              <FytliSun activityLevel={activityLevel} userCount={userCount} />
            </View>
            
            <Text style={styles.loadingText}>
              {activityLevel < 1 ? 'Chargement...' : 'Prêt à briller ! ✨'}
            </Text>
          </Animated.View>

          {/* Texte central */}
          <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
            <Text style={styles.tagline}>Seul, mais ensemble.</Text>
            <Text style={styles.subtitle}>
              Bouge, connecte-toi, fais briller ton cercle.
            </Text>
          </Animated.View>

          {/* Bouton */}
          <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
            <GradientButton
              title="Commencer"
              onPress={() => navigation.navigate('Login')}
              size="large"
              gradient={['#FFFFFF', '#FFFFFF']}
              textStyle={{ color: '#D94A28', fontWeight: '900' }}
              style={styles.button}
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
    justifyContent: 'space-evenly',
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
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 3,
    marginBottom: SPACING.xl,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
  },
  sunLoadingContainer: {
    marginVertical: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: SPACING.lg,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  tagline: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: SPACING.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default SplashScreen;

