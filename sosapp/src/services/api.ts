import {Config} from 'react-native-config';
import {API_ENDPOINT_TEST, API_ENDPOINT, ERROR_CODE} from '@constants';

type API = {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  data: any;
  route: string;
};

const callAPI = async ({data, method, route}: API) => {
  try {
    let url = (Config.ENV === 'dev' ? API_ENDPOINT_TEST : API_ENDPOINT) + route;
    let options = {};

    switch (method) {
      case 'POST':
      case 'PUT':
        options = {
          body: JSON.stringify(data),
          method,
          headers: {'Content-Type': 'application/json'},
        };

        break;
      default:
        options = {method: 'GET'};
        break;
    }

    console.log(url);
    const res = await fetch(url, options);
    const _data = await res.json();
    return {data: _data, status: res.status};
  } catch (error) {
    console.log(error);
    return {data: null, status: ERROR_CODE, message: error};
  }
};

export {callAPI};
