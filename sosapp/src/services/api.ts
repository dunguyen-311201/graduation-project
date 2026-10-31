import auth from '@react-native-firebase/auth';
import {Config} from 'react-native-config';
import {API_ENDPOINT_TEST, API_ENDPOINT_TEST1, ERROR_CODE} from '@constants';

type API = {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  data?: any;
  route: string;
};

const callAPI = async ({data, method, route}: API) => {
  try {
    // ENV=dev points at the local emulator; anything else uses the deployed API.
    let url =
      (Config.ENV === 'dev' ? API_ENDPOINT_TEST1 : API_ENDPOINT_TEST) + route;
    let options: RequestInit = {};

    // The API verifies the Firebase ID token of the signed-in user.
    const idToken = await auth().currentUser?.getIdToken();
    const authHeader: Record<string, string> = idToken
      ? {Authorization: `Bearer ${idToken}`}
      : {};

    switch (method) {
      case 'POST':
      case 'DELETE':
      case 'PUT':
        options = {
          ...(data && {body: JSON.stringify(data)}),
          method,
          headers: {'Content-Type': 'application/json', ...authHeader},
        };

        break;
      default:
        options = {method: 'GET', headers: authHeader};
        break;
    }

    const res = await fetch(url, options);
    const _data = await res.json();
    return {data: _data, status: res.status};
  } catch (error) {
    return {data: null, status: ERROR_CODE, message: error};
  }
};

export {callAPI};
