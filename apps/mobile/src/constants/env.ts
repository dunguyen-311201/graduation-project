// Public build-time config. Expo inlines EXPO_PUBLIC_* variables from .env
// into the JS bundle, so never put secrets here (see .env.example).
export const ENV = {
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV ?? 'prod',
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:4000/',
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
};
