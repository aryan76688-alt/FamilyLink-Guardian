/**
 * FamilyLink Guardian - Centralized Design Tokens
 * 
 * Defines standard tokens for colors, typography, spacing, border radii,
 * elevations, and dark mode themes matching the design system.
 */

export const colors = {
  light: {
    primaryDeepNavy: '#062B52',
    primaryBlue: '#087CF5',
    brightBlue: '#168DFF',
    skyBlue: '#53B9FF',
    background: '#F5F8FC',
    card: '#FFFFFF',
    textPrimary: '#10243E',
    textSecondary: '#718096',
    success: '#22B573',
    warning: '#F4A62A',
    danger: '#EF4444',
    border: '#E4EAF2',
  },
  dark: {
    background: '#071321',
    surface: '#0D2035',
    elevatedSurface: '#102A44',
    primary: '#2495FF',
    textPrimary: '#F0F4F8',
    textSecondary: '#94A3B8',
    success: '#22B573',
    warning: '#F4A62A',
    danger: '#EF4444',
    border: '#1E3A5A',
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
} as const;

export const radii = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 3px rgba(6, 43, 82, 0.05)',
  md: '0 4px 14px -2px rgba(6, 43, 82, 0.08)',
  lg: '0 10px 25px -4px rgba(6, 43, 82, 0.12)',
  glow: '0 0 20px rgba(8, 124, 245, 0.25)',
} as const;

export const typography = {
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  display: {
    fontSize: '32px',
    lineHeight: '40px',
    fontWeight: '600',
  },
  heading: {
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: '600',
  },
  section: {
    fontSize: '18px',
    lineHeight: '26px',
    fontWeight: '500',
  },
  body: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '400',
  },
  caption: {
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: '400',
  },
  status: {
    fontSize: '11px',
    lineHeight: '16px',
    fontWeight: '500',
  },
} as const;
