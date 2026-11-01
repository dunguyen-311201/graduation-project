import Constants from 'expo-constants';

// Public build-time config. Expo inlines EXPO_PUBLIC_* variables from .env
// into the JS bundle, so never put secrets here (see .env.example).
export const ENV = {
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV ?? 'prod',
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:4000/',
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
};

// False when the app was built without GOOGLE_MAPS_ANDROID_API_KEY. Rendering
// a Google MapView then crashes the app, so show a fallback instead.
export const MAPS_ENABLED = Boolean(
  Constants.expoConfig?.extra?.hasNativeMapsKey,
);

// Opens the location in the Google Maps app or browser; needs no API key.
export const externalMapUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
