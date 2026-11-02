// Single place that creates the React Native Firebase (modular API) instances.
// Business writes are moving to the NestJS API (ADR-0011); reads stay here.
import {getAuth} from '@react-native-firebase/auth';
import {getFirestore} from '@react-native-firebase/firestore';
import {getMessaging} from '@react-native-firebase/messaging';

export const auth = getAuth();
export const db = getFirestore();
export const messaging = getMessaging();

// Emulators fail the app check and its browser fallback. In development only,
// skip it; this works only with the test numbers set in the Firebase console.
if (__DEV__) {
  auth.settings.appVerificationDisabledForTesting = true;
}
