import {Config} from 'react-native-config';

// Base URL of the NestJS API (services/api), set in .env.
// Local dev from the Android emulator: http://10.0.2.2:4000/
// Physical phone: use your PC's LAN IP, e.g. http://192.168.1.10:4000/
const RAW_API_URL = Config.API_URL || 'http://10.0.2.2:4000/';
const API_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL : `${RAW_API_URL}/`;

const Route = {
  RESPONDERS: 'v1/responders',
};

const ERROR_CODE = 404;

export {Route, API_URL, ERROR_CODE};
