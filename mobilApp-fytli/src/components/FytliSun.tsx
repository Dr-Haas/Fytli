import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop, G } from 'react-native-svg';

/**
 * Interface des props du composant FytliSun
 * 
 * @param activityLevel - Niveau d'activité collective (0 à 1)
 * @param userCount - Nombre d'utilisateurs connectés à la session
 */
interface FytliSunProps {
  activityLevel: number; // 0 à 1
  userCount: number;     // nombre d'utilisateurs connectés
}

// Composants SVG animés
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

/**
 * Composant FytliSun pour React Native
 * 
 * Représentation visuelle du Soleil Fytli, symbole de l'énergie collective.
 * Plus les utilisateurs sont actifs et connectés, plus le soleil brille intensément.
 * 
 * "Plus on bouge ensemble, plus la lumière s'intensifie." ☀️
 */
export const FytliSun: React.FC<FytliSunProps> = ({ activityLevel, userCount }) => {
  // Normaliser l'activityLevel entre 0 et 1
  const normalizedActivity = Math.max(0, Math.min(1, activityLevel));

  // États et références pour les animations
  const [previousUserCount, setPreviousUserCount] = useState(userCount);
  
  // Animation du cœur (pulsation)
  const coreScale = useRef(new Animated.Value(1)).current;
  
  // Animation du halo (glow)
  const haloOpacity = useRef(new Animated.Value(0.4)).current;
  const haloStrokeWidth = useRef(new Animated.Value(8)).current;
  
  // Animations des orbes (rotations)
  const orb1Rotation = useRef(new Animated.Value(0)).current;
  const orb2Rotation = useRef(new Animated.Value(0)).current;
  const orb3Rotation = useRef(new Animated.Value(0)).current;
  const orb4Rotation = useRef(new Animated.Value(0)).current;

  // Animation de pulsation du cœur du soleil
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(coreScale, {
          toValue: 1 + normalizedActivity * 0.15,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(coreScale, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, [normalizedActivity, coreScale]);

  // Animation du halo lumineux
  useEffect(() => {
    const targetOpacity = 0.3 + normalizedActivity * 0.4;
    const targetStrokeWidth = 6 + normalizedActivity * 8;

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(haloOpacity, {
            toValue: targetOpacity + 0.2,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(haloStrokeWidth, {
            toValue: targetStrokeWidth + 4,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(haloOpacity, {
            toValue: targetOpacity,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(haloStrokeWidth, {
            toValue: targetStrokeWidth,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ])
    );
    glowAnimation.start();
    return () => glowAnimation.stop();
  }, [normalizedActivity, haloOpacity, haloStrokeWidth]);

  // Animations des orbes en orbite
  useEffect(() => {
    const createOrbitAnimation = (rotation: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
    };

    const animations = [
      createOrbitAnimation(orb1Rotation, 6000),
      createOrbitAnimation(orb2Rotation, 9000),
      createOrbitAnimation(orb3Rotation, 7000),
      createOrbitAnimation(orb4Rotation, 5000),
    ];

    animations.forEach(anim => anim.start());
    return () => animations.forEach(anim => anim.stop());
  }, [orb1Rotation, orb2Rotation, orb3Rotation, orb4Rotation]);

  // Détecte l'arrivée d'un nouvel utilisateur et déclenche une pulsation du halo
  useEffect(() => {
    if (userCount > previousUserCount) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(haloOpacity, {
            toValue: 0.9,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(haloStrokeWidth, {
            toValue: 16,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(haloOpacity, {
            toValue: 0.4,
            duration: 400,
            easing: Easing.in(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(haloStrokeWidth, {
            toValue: 8,
            duration: 400,
            easing: Easing.in(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ]).start();
    }
    setPreviousUserCount(userCount);
  }, [userCount, previousUserCount, haloOpacity, haloStrokeWidth]);

  // Configuration des orbes (simplifié pour React Native)
  const orbsToShow = Math.min(userCount, 5);
  const orbConfigs = [
    { rotation: orb1Rotation, radius: 80, size: 4, color: '#FFF200' },
    { rotation: orb2Rotation, radius: 100, size: 6, color: '#FFAA00' },
    { rotation: orb3Rotation, radius: 90, size: 3, color: '#FF6B00' },
    { rotation: orb4Rotation, radius: 70, size: 5, color: '#FF8C00' },
    { rotation: orb1Rotation, radius: 110, size: 4, color: '#FFD700' },
  ];

  // Interpolation des rotations pour les transformations
  const getRotationStyle = (rotation: Animated.Value) => {
    return {
      transform: [{
        rotate: rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        })
      }]
    };
  };

  return (
    <View style={[styles.container, { 
      shadowRadius: 30 + normalizedActivity * 20,
      shadowOpacity: 0.6 + normalizedActivity * 0.3 
    }]}>
      <Svg width={250} height={250} viewBox="0 0 250 250">
        {/* Définition du dégradé radial pour le cœur du soleil */}
        <Defs>
          <RadialGradient id="fytliGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFEB3B" />
            <Stop offset="50%" stopColor="#FF9800" />
            <Stop offset="100%" stopColor="#FF5722" />
          </RadialGradient>
        </Defs>

        {/* Halo lumineux extérieur */}
        <AnimatedCircle
          cx="125"
          cy="125"
          r="90"
          fill="none"
          stroke="#FFD700"
          strokeWidth={haloStrokeWidth}
          opacity={haloOpacity}
        />

        {/* Cœur du soleil avec animation de pulsation */}
        <AnimatedCircle
          cx="125"
          cy="125"
          r="60"
          fill="url(#fytliGradient)"
          scale={coreScale}
          origin="125, 125"
        />

        {/* Orbes gravitant autour (avec rotation simple) */}
        {orbConfigs.slice(0, orbsToShow).map((config, index) => {
          const rotationStyle = getRotationStyle(config.rotation);
          return (
            <AnimatedG key={index} origin="125, 125" {...rotationStyle}>
              <Circle
                cx={125 + config.radius}
                cy="125"
                r={config.size}
                fill={config.color}
                opacity={0.8}
              />
            </AnimatedG>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFAA00',
    shadowOffset: { width: 0, height: 0 },
  },
});

export default FytliSun;
