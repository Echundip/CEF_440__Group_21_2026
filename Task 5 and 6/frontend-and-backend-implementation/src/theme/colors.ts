/**
 * Central color palette for the Adaptive E-Learning Platform.
 * Primary brand color is a deep navy blue.
 */
export const colors = {
  navy: '#0B2447',
  navyDark: '#071A36',
  navyLight: '#19376D',
  accent: '#576CBC',
  accentSoft: '#A5D7E8',

  background: '#F4F6FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF2FA',

  text: '#0B2447',
  textMuted: '#5B6577',
  textInverse: '#FFFFFF',

  border: '#DCE3F0',

  // Network / QoE status colors
  good: '#1B873F',
  goodSoft: '#E4F6EA',
  moderate: '#B7791F',
  moderateSoft: '#FBF1DC',
  poor: '#C0392B',
  poorSoft: '#FBE6E3',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export type AppColor = keyof typeof colors;
