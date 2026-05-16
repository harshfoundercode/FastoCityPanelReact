// src/styles/theme.js
export const colors = {
  // Primary colors (matching Flutter)
  primaryGreen: '#14532D',
  primaryLightGreen: '#4ADE80',
  primaryExtraLightGreen: '#F0FDF4',
  
  // Text colors
  textBlack: '#1F2937',
  textGrey1: '#6B7280',
  textGrey2: '#9CA3AF',
  
  // Background colors
  bgColor: '#F9FAFB',
  containerGrey2: '#F3F4F6',
};

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primaryGreen}, ${colors.primaryLightGreen})`,
  light: `linear-gradient(135deg, ${colors.primaryExtraLightGreen}, ${colors.primaryLightGreen}20)`,
};

export const shadows = {
  card: '0 10px 40px rgba(0, 0, 0, 0.1)',
  button: '0 4px 15px rgba(20, 83, 45, 0.2)',
};