// Design tokens for the redesign (docs: SOS app UI redesign proposal).
// Dark and light palettes; see ThemeProvider for how the active one is chosen.

export type Palette = {
  bg: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  primary: string;
  primaryPressed: string;
  primarySoft: string;
  gradientStart: string;
  gradientEnd: string;
  sos: string;
  sosPressed: string;
  sosGlow: string;
  success: string;
  successSoft: string;
  warning: string;
  text: string;
  textMuted: string;
  onPrimary: string;
  scrim: string;
};

export type Scheme = 'dark' | 'light';

export const palettes: Record<Scheme, Palette> = {
  dark: {
    bg: '#0F0F10',
    surface: '#1A1A1A',
    surfaceRaised: '#242426',
    border: '#2E2E32',
    primary: '#535AFF',
    primaryPressed: '#4148E0',
    primarySoft: 'rgba(83, 90, 255, 0.16)',
    gradientStart: '#3D7BFF',
    gradientEnd: '#535AFF',
    sos: '#E5484D',
    sosPressed: '#C93A3F',
    sosGlow: 'rgba(229, 72, 77, 0.25)',
    success: '#30A46C',
    successSoft: 'rgba(48, 164, 108, 0.16)',
    warning: '#F5A524',
    text: '#F5F7FA',
    textMuted: '#9BA1A6',
    onPrimary: '#FFFFFF',
    scrim: 'rgba(0, 0, 0, 0.55)',
  },
  light: {
    bg: '#F5F6F8',
    surface: '#FFFFFF',
    surfaceRaised: '#ECEEF2',
    border: '#D9DDE3',
    primary: '#4A51F0',
    primaryPressed: '#3A40D6',
    primarySoft: 'rgba(74, 81, 240, 0.12)',
    gradientStart: '#3D7BFF',
    gradientEnd: '#4A51F0',
    sos: '#D93036',
    sosPressed: '#B8262B',
    sosGlow: 'rgba(217, 48, 54, 0.18)',
    success: '#1E8A55',
    successSoft: 'rgba(30, 138, 85, 0.12)',
    warning: '#A86200',
    text: '#111418',
    textMuted: '#5D6670',
    onPrimary: '#FFFFFF',
    scrim: 'rgba(0, 0, 0, 0.4)',
  },
};

// The active palette. ThemeProvider swaps its values when the scheme changes
// and remounts the app, so every read at render time (including themed
// styles) gets the new colors. Never copy a value out of it at module level.
export const colors: Palette = {...palettes.dark};

let current: Scheme = 'dark';
export const currentScheme = () => current;

export const applyScheme = (scheme: Scheme) => {
  current = scheme;
  Object.assign(colors, palettes[scheme]);
};

// Like StyleSheet.create, but built lazily per scheme so style objects that
// read `colors` follow the active theme.
export const themedStyles = <T,>(factory: () => T): T => {
  const cache: Partial<Record<Scheme, T>> = {};
  const get = () => (cache[current] ??= factory());
  return new Proxy({} as any, {
    get: (_, key) => (get() as any)[key],
    has: (_, key) => key in (get() as any),
    ownKeys: () => Reflect.ownKeys(get() as any),
    // Styles may be frozen in dev; a proxy must not report a frozen
    // (non-configurable) property its empty target does not have.
    getOwnPropertyDescriptor: (_, key) => {
      const d = Object.getOwnPropertyDescriptor(get() as any, key);
      return d && {...d, configurable: true};
    },
  }) as T;
};

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
  title: {fontSize: 24, lineHeight: 30, fontWeight: '700'},
  heading: {fontSize: 18, lineHeight: 24, fontWeight: '600'},
  body: {fontSize: 15, lineHeight: 22, fontWeight: '400'},
  label: {fontSize: 14, lineHeight: 20, fontWeight: '600'},
  caption: {fontSize: 12, lineHeight: 16, fontWeight: '400'},
} as const;

// Minimum touch target (Material 48 dp).
export const TOUCH = 48;
