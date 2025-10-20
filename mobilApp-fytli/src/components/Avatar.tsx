import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS, SHADOWS } from '@config/theme';

interface AvatarProps {
  imageUrl?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: ViewStyle;
  showGlow?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  name,
  size = 'medium',
  style,
  showGlow = false,
}) => {
  const sizeStyles = {
    small: { width: 40, height: 40, borderRadius: 20 },
    medium: { width: 60, height: 60, borderRadius: 30 },
    large: { width: 80, height: 80, borderRadius: 40 },
    xlarge: { width: 120, height: 120, borderRadius: 60 },
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <View style={[styles.container, sizeStyles[size], showGlow && styles.glow, style]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={[styles.image, sizeStyles[size]]} />
      ) : (
        <View style={[styles.placeholder, sizeStyles[size]]}>
          <Text style={[styles.initials, { fontSize: sizeStyles[size].width / 2.5 }]}>
            {initials}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  glow: {
    ...SHADOWS.lg,
    shadowColor: COLORS.orange,
    shadowOpacity: 0.3,
  },
});

export default Avatar;

