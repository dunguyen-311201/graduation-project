import {Config} from 'react-native-config';
import {API_ENDPOINT_TEST, API_ENDPOINT_TEST1, ERROR_CODE} from '@constants';

type API = {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  data?: any;
  route: string;
};

const callAPI = async ({data, method, route}: API) => {
  try {
    let url =
      (Config.ENV === 'dev' ? API_ENDPOINT_TEST : API_ENDPOINT_TEST1) + route;
    let options = {};

    switch (method) {
      case 'POST':
      case 'DELETE':
      case 'PUT':
        options = {
          ...(data && {body: JSON.stringify(data)}),
          method,
          headers: {'Content-Type': 'application/json'},
        };

        break;
      default:
        options = {method: 'GET'};
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
