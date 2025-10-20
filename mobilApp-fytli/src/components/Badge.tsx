import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '@config/theme';

interface BadgeProps {
  icon?: string;
  label?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const Badge: React.FC<BadgeProps> = ({
  icon = '🏆',
  label,
  color = COLORS.orange,
  size = 'medium',
  style,
}) => {
  const sizeStyles = {
    small: { width: 40, height: 40, iconSize: 20 },
    medium: { width: 60, height: 60, iconSize: 30 },
    large: { width: 80, height: 80, iconSize: 40 },
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.badge,
          {
            width: sizeStyles[size].width,
            height: sizeStyles[size].height,
            borderRadius: sizeStyles[size].width / 2,
            backgroundColor: color,
          },
        ]}
      >
        <Text style={[styles.icon, { fontSize: sizeStyles[size].iconSize }]}>{icon}</Text>
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    lineHeight: undefined, // Let emoji render naturally
  },
  label: {
    marginTop: SPACING.xs,
    fontSize: 12,
    color: COLORS.warmText,
    textAlign: 'center',
  },
});

export default Badge;

