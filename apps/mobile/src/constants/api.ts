import {ApiRoute} from '@sos/contracts';

import {ENV} from './env';

// Base URL of the NestJS API (services/api), EXPO_PUBLIC_API_URL in .env.
// Local dev from the Android emulator: http://10.0.2.2:4000/
// Physical phone: use your PC's LAN IP, e.g. http://192.168.1.10:4000/
const RAW_API_URL = ENV.API_URL;
const API_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL : `${RAW_API_URL}/`;

// Paths are shared with the API through @sos/contracts.
const Route = ApiRoute;

const ERROR_CODE = 404;

export {Route, API_URL, ERROR_CODE};
