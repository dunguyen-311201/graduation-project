// Design tokens for the redesign (docs: SOS app UI redesign proposal).
// Dark only for now. Screens move to these values one slice at a time.

export const colors = {
  bg: '#0F0F10',
  surface: '#1A1A1A',
  surfaceRaised: '#242426',
  border: '#2E2E32',
  primary: '#535AFF',
  primaryPressed: '#4148E0',
  gradientStart: '#3D7BFF',
  gradientEnd: '#535AFF',
  sos: '#E5484D',
  sosPressed: '#C93A3F',
  sosGlow: 'rgba(229, 72, 77, 0.25)',
  success: '#30A46C',
  warning: '#F5A524',
  text: '#F5F7FA',
  textMuted: '#9BA1A6',
  onPrimary: '#FFFFFF',
  scrim: 'rgba(0, 0, 0, 0.55)',
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  card: 12,
  sheet: 20,
  pill: 999,
} as const;

export const type = {
  title: {fontSize: 28, lineHeight: 34, fontWeight: '700'},
  heading: {fontSize: 22, lineHeight: 28, fontWeight: '600'},
  body: {fontSize: 17, lineHeight: 24, fontWeight: '400'},
  label: {fontSize: 15, lineHeight: 20, fontWeight: '600'},
  caption: {fontSize: 13, lineHeight: 18, fontWeight: '400'},
} as const;

// Minimum touch target (Material 48 dp).
export const TOUCH = 48;
