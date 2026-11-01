import type {ConfigContext, ExpoConfig} from 'expo/config';

// Values come from .env (loaded by the Expo CLI) or EAS environment variables.
// google-services.json is per Firebase project and stays out of git; on EAS,
// upload it as a file variable named GOOGLE_SERVICES_JSON.
const googleServicesFile =
  process.env.GOOGLE_SERVICES_JSON ?? './google-services.json';

export default ({config}: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'SOS',
  slug: 'sosapp',
  scheme: 'sosapp',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  android: {
    package: 'com.sosapp',
    versionCode: 1,
    googleServicesFile,
    adaptiveIcon: {
      backgroundColor: '#FFFFFF',
      foregroundImage: './assets/icon.png',
    },
    blockedPermissions: ['android.permission.RECORD_AUDIO'],
    permissions: [
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.POST_NOTIFICATIONS',
    ],
    config: {
      googleMaps: {apiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY},
    },
  },
  ios: {
    bundleIdentifier: 'com.sosapp',
    supportsTablet: false,
    googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST,
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_IOS_API_KEY,
    },
  },
  plugins: [
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    '@react-native-firebase/messaging',
    [
      'expo-build-properties',
      // React Native Firebase needs static frameworks on iOS. firebase-auth 25
      // is compiled with Kotlin metadata 2.4, which Kotlin 2.2 cannot read.
      {ios: {useFrameworks: 'static'}, android: {kotlinVersion: '2.3.20'}},
    ],
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'SOS uses your location to send it to the nearest rescue center.',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'SOS lets you pick a profile photo.',
        cameraPermission: false,
        microphonePermission: false,
      },
    ],
    '@react-native-community/datetimepicker',
  ],
});
