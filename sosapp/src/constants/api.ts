import {Config} from 'react-native-config';

// Endpoints are derived from .env so switching Firebase projects only needs
// a new .env (see sosapp/.env.example).
const PROJECT_ID = Config.FIREBASE_PROJECT_ID;
const REGION = Config.FUNCTIONS_REGION || 'us-central1';
const EMULATOR_HOST = Config.EMULATOR_HOST || '10.0.2.2';

// Local Functions emulator (ENV=dev). 10.0.2.2 is the host machine as seen
// from the Android emulator; use your PC's LAN IP for a physical device.
const API_ENDPOINT_TEST1 = `http://${EMULATOR_HOST}:3000/${PROJECT_ID}/${REGION}/app/`;
// Deployed Functions.
const API_ENDPOINT_TEST = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/app/`;
const Route = {
  MESSAGE: 'messages',
  USER: 'users',
};

const ERROR_CODE = 404;

export {Route, API_ENDPOINT_TEST1, API_ENDPOINT_TEST, ERROR_CODE};
