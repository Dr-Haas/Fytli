import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BORDER_RADIUS, SPACING, GRADIENTS } from '@config/theme';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  height?: number;
  style?: ViewStyle;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = false,
  height = 8,
  style,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {showPercentage && <Text style={styles.percentage}>{clampedProgress}%</Text>}
        </View>
      )}
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        <LinearGradient
          colors={GRADIENTS.warm}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              height,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: 14,
    color: COLORS.warmText,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 14,
    color: COLORS.orange,
    fontWeight: '600',
  },
  track: {
    backgroundColor: COLORS.lightGray,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: COLORS.orange,
  },
});

export default ProgressBar;

