import messaging from '@react-native-firebase/messaging';

const getDeviceToken = async () => {
  return messaging().getToken();
};

export {getDeviceToken};
