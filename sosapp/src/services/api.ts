import {API_ENDPOINT_TEST, Route} from '@constants';

type API = {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  data: any;
  route: keyof typeof Route;
};

const callAPI = async ({data, method, route}: API) => {
  try {
    const url = `${API_ENDPOINT_TEST}/${Route[route]}`;
    let options = {};

    switch (method) {
      case 'POST':
        options = {
          body: JSON.stringify(data),
          method: 'POST',
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
    console.log(error);
    return {data: null, status: 400, message: error};
  }
};

export {callAPI};
