import {getAuth, getIdToken} from '@react-native-firebase/auth';
import {API_URL, ERROR_CODE} from '@constants';

type API = {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  data?: any;
  route: string;
};

const callAPI = async ({data, method, route}: API) => {
  try {
    const url = API_URL + route;
    let options: RequestInit = {};

    // The API verifies the Firebase ID token of the signed-in user.
    const user = getAuth().currentUser;
    const idToken = user ? await getIdToken(user) : undefined;
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
    // Some responses (204, proxy errors) have no JSON body.
    const _data = await res.json().catch(() => null);
    return {data: _data, status: res.status};
  } catch (error) {
    return {data: null, status: ERROR_CODE, message: error};
  }
};

export {callAPI};
