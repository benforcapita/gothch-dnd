import { DarkTheme } from '@react-navigation/native';
import type { ThemeColors, Rarity } from '../types';

export const colors: ThemeColors = {
  primary: '#4FC3F7', // Teal/Blue accent
  secondary: '#29B6F6', // Lighter blue
  tertiary: '#0277BD', // Darker blue
  
  background: '#0D1B2A', // Very dark blue/navy
  surface: '#1B263B', // Dark blue-grey
  card: '#1E2A3A', // Card background
  
  text: '#FFFFFF',
  textSecondary: '#B0BEC5',
  textMuted: '#78909C',
  
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Rarity colors
  common: '#9E9E9E',
  uncommon: '#4CAF50',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FF9800',
  
  // Battle colors
  playerHP: '#4CAF50',
  enemyHP: '#F44336',
  damage: '#FF5722',
  heal: '#8BC34A',
  
  // Opacity variants
  overlay: 'rgba(0, 0, 0, 0.8)',
  cardShadow: 'rgba(0, 0, 0, 0.4)',
  border: 'rgba(79, 195, 247, 0.2)',
};

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export interface BorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  round: number;
}

export const borderRadius: BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export interface Typography {
  h1: {
    fontSize: number;
    fontWeight: 'bold';
    lineHeight: number;
  };
  h2: {
    fontSize: number;
    fontWeight: 'bold';
    lineHeight: number;
  };
  h3: {
    fontSize: number;
    fontWeight: '600';
    lineHeight: number;
  };
  h4: {
    fontSize: number;
    fontWeight: '600';
    lineHeight: number;
  };
  body: {
    fontSize: number;
    fontWeight: '400';
    lineHeight: number;
  };
  bodySmall: {
    fontSize: number;
    fontWeight: '400';
    lineHeight: number;
  };
  caption: {
    fontSize: number;
    fontWeight: '400';
    lineHeight: number;
  };
  button: {
    fontSize: number;
    fontWeight: '600';
    lineHeight: number;
  };
}

export const typography: Typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
};

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface Shadows {
  small: ShadowStyle;
  medium: ShadowStyle;
  large: ShadowStyle;
}

export const shadows: Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
};

export const getRarityColor = (rarity?: Rarity): string => {
  switch (rarity?.toLowerCase()) {
    case 'common':
      return colors.common;
    case 'uncommon':
      return colors.uncommon;
    case 'rare':
      return colors.rare;
    case 'epic':
      return colors.epic;
    case 'legendary':
      return colors.legendary;
    default:
      return colors.common;
  }
};

export const getStatColor = (stat: string, value: number): string => {
  if (stat === 'hit_points') {
    return value > 50 ? colors.success : value > 25 ? colors.warning : colors.error;
  }
  return colors.primary;
}; 