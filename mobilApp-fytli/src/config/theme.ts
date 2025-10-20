// Configuration du thème Fytli
export const COLORS = {
  // Palette principale (dégradé jaune-orange-rouge)
  yellow: '#FFD56B',
  orange: '#FFA34A',
  red: '#FF7948',
  
  // Fond et neutres
  cream: '#FBFAF7',
  warmText: '#4A2E20',
  white: '#FFFFFF',
  
  // États
  gray: '#D1D5DB',
  lightGray: '#F3F4F6',
  darkGray: '#6B7280',
  
  // Overlay
  whiteTransparent: 'rgba(255, 255, 255, 0.8)',
  blackTransparent: 'rgba(0, 0, 0, 0.3)',
};

export const GRADIENTS = {
  primary: ['#FFD56B', '#FFA34A', '#FF7948'],
  soft: ['#FBFAF7', '#FFA34A'],
  warm: ['#FFA34A', '#FF7948'],
  blue: ['#3B82F6', '#2563EB'],
  green: ['#10B981', '#059669'],
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

