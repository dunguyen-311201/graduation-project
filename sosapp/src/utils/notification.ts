import messaging from '@react-native-firebase/messaging';

const subcribeNotifyAppOpen = (callback: (uid: string) => void) => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    if (remoteMessage?.data) {
      callback(remoteMessage.data.id);
    }
  });
  return unsubscribe;
};

export {subcribeNotifyAppOpen};
