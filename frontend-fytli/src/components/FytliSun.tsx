import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

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

/**
 * Animation de pulsation du cœur du soleil
 * S'intensifie avec l'activité collective
 */
const pulse = (intensity: number) => keyframes`
  0%, 100% { 
    transform: scale(1); 
    filter: brightness(${1 + intensity * 0.3});
  }
  50% { 
    transform: scale(${1 + intensity * 0.1}); 
    filter: brightness(${1.3 + intensity * 0.5});
  }
`;

/**
 * Animation du halo lumineux
 * Plus l'activité est haute, plus le halo est visible
 */
const glow = (intensity: number) => keyframes`
  0%, 100% { 
    opacity: ${0.3 + intensity * 0.2}; 
    stroke-width: ${6 + intensity * 4};
  }
  50% { 
    opacity: ${0.6 + intensity * 0.3}; 
    stroke-width: ${10 + intensity * 6};
  }
`;

/**
 * Animations d'orbite pour les bulles d'utilisateurs
 * Chaque orbe a sa propre vitesse et distance
 */
const orbit1 = keyframes`
  from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
`;

const orbit2 = keyframes`
  from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
`;

const orbit3 = keyframes`
  from { transform: rotate(0deg) translateX(90px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
`;

const orbit4 = keyframes`
  from { transform: rotate(0deg) translateX(70px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(70px) rotate(-360deg); }
`;

const orbit5 = keyframes`
  from { transform: rotate(0deg) translateX(110px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(110px) rotate(-360deg); }
`;

/**
 * Animation de pulsation du halo lors de l'arrivée d'un nouvel utilisateur
 */
const userJoinPulse = keyframes`
  0% { 
    stroke-width: 8;
    opacity: 0.4;
  }
  50% { 
    stroke-width: 16;
    opacity: 0.9;
  }
  100% { 
    stroke-width: 8;
    opacity: 0.4;
  }
`;

// Styled Components

const SunWrapper = styled.div<{ $activityLevel: number }>`
  width: 250px;
  height: 250px;
  position: relative;
  filter: drop-shadow(0 0 ${props => 30 + props.$activityLevel * 20}px rgba(255, 160, 0, ${0.6 + props.$activityLevel * 0.3}));
  transition: filter 0.5s ease-in-out;
`;

const SunSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

const Core = styled.circle<{ $intensity: number }>`
  animation: ${props => pulse(props.$intensity)} 3s ease-in-out infinite;
  transform-origin: center;
  transition: all 0.5s ease-in-out;
`;

const Halo = styled.circle<{ $intensity: number; $userJoined: boolean }>`
  transform-origin: center;
  transition: all 0.3s ease-in-out;
  
  ${props => props.$userJoined 
    ? css`animation: ${userJoinPulse} 0.8s ease-out;`
    : css`animation: ${glow(props.$intensity)} 6s ease-in-out infinite;`
  }
`;

const Orb = styled.circle<{ $orbitNumber: number }>`
  transform-origin: 125px 125px;
  opacity: 0.8;
  transition: opacity 0.3s ease-in-out;
  
  &.orb1 { animation: ${orbit1} 6s linear infinite; }
  &.orb2 { animation: ${orbit2} 9s linear infinite; }
  &.orb3 { animation: ${orbit3} 7s linear infinite; }
  &.orb4 { animation: ${orbit4} 5s linear infinite; }
  &.orb5 { animation: ${orbit5} 8s linear infinite; }
`;

/**
 * Composant FytliSun
 * 
 * Représentation visuelle du Soleil Fytli, symbole de l'énergie collective.
 * Plus les utilisateurs sont actifs et connectés, plus le soleil brille intensément.
 * 
 * "Plus on bouge ensemble, plus la lumière s'intensifie." ☀️
 */
export const FytliSun: React.FC<FytliSunProps> = ({ activityLevel, userCount }) => {
  const [userJoined, setUserJoined] = useState(false);
  const [previousUserCount, setPreviousUserCount] = useState(userCount);

  // Normaliser l'activityLevel entre 0 et 1
  const normalizedActivity = Math.max(0, Math.min(1, activityLevel));

  // Détecte l'arrivée d'un nouvel utilisateur et déclenche une pulsation
  useEffect(() => {
    if (userCount > previousUserCount) {
      setUserJoined(true);
      const timer = setTimeout(() => setUserJoined(false), 800);
      return () => clearTimeout(timer);
    }
    setPreviousUserCount(userCount);
  }, [userCount, previousUserCount]);

  // Génère les orbes en fonction du nombre d'utilisateurs (max 8 pour la lisibilité)
  const orbsToShow = Math.min(userCount, 8);
  const orbColors = ['#FFD75F', '#FFC64D', '#FF9A2B', '#FFB347', '#FFD75F', '#FFC64D', '#FF9A2B', '#FFB347'];
  const orbSizes = [4, 6, 3, 5, 4, 5, 3, 4];
  const orbClasses = ['orb1', 'orb2', 'orb3', 'orb4', 'orb5', 'orb1', 'orb2', 'orb3'];

  return (
    <SunWrapper $activityLevel={normalizedActivity}>
      <SunSvg viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
        {/* Définition du dégradé radial pour le cœur du soleil */}
        <defs>
          <radialGradient id="fytliGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD75F"/>
            <stop offset="60%" stopColor="#FF7A00"/>
            <stop offset="100%" stopColor="#B84300"/>
          </radialGradient>
          
          {/* Filtre de flou pour un effet plus doux sur le halo */}
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Halo lumineux extérieur */}
        <Halo 
          className="halo" 
          cx="125" 
          cy="125" 
          r="90" 
          fill="none" 
          stroke="#FFB347" 
          strokeWidth="8" 
          opacity="0.4"
          filter="url(#softGlow)"
          $intensity={normalizedActivity}
          $userJoined={userJoined}
        />

        {/* Cœur du soleil */}
        <Core 
          className="core" 
          cx="125" 
          cy="125" 
          r="60" 
          fill="url(#fytliGradient)"
          $intensity={normalizedActivity}
        />

        {/* Orbes gravitant autour (représentent les utilisateurs connectés) */}
        {Array.from({ length: orbsToShow }).map((_, index) => (
          <Orb
            key={index}
            className={`orb ${orbClasses[index]}`}
            r={orbSizes[index]}
            cx="125"
            cy={index % 2 === 0 ? '35' : '215'}
            fill={orbColors[index]}
            $orbitNumber={index}
          />
        ))}
      </SunSvg>
    </SunWrapper>
  );
};

export default FytliSun;

