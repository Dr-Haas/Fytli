import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS, COLORS, BORDER_RADIUS, SPACING } from '@config/theme';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  gradient?: string[];
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  gradient = GRADIENTS.warm,
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const sizeStyles = {
    small: { paddingVertical: 10, paddingHorizontal: 20, fontSize: 14 },
    medium: { paddingVertical: 14, paddingHorizontal: 32, fontSize: 16 },
    large: { paddingVertical: 18, paddingHorizontal: 40, fontSize: 18 },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.container, style]}
    >
      <LinearGradient
        colors={disabled ? [COLORS.gray, COLORS.darkGray] : gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradient,
          {
            paddingVertical: sizeStyles[size].paddingVertical,
            paddingHorizontal: sizeStyles[size].paddingHorizontal,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} size="small" />
        ) : (
          <Text style={[styles.text, { fontSize: sizeStyles[size].fontSize }, textStyle]}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.xl,
  },
  text: {
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GradientButton;

