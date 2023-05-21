import {useCallback, useEffect, useState} from 'react';
import {PermissionsAndroid, Linking, Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import {EScreen} from '@enums';
import useMessage from './useMessage';
import useAuth from './useAuth';

const useNotify = ({navigate}: {navigate: any}) => {
  const [muid, setMuid] = useState<string>();
  const [body, setBody] = useState<string>();

  const {message} = useMessage(muid);

  const {currentUser} = useAuth();

  const handleNotify = useCallback(
    (uid: string, userId?: string) => {
      if (userId === currentUser?.uid) {
        navigate(EScreen.DETAIL_MESSAGE, {uid});
        return;
      }

      navigate(EScreen.MESSAGES);
    },
    [currentUser?.uid, navigate],
  );

  useEffect(() => {
    // Handle Notifications app open
    const setup = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      await messaging().requestPermission();

      if (granted === PermissionsAndroid.RESULTS.DENY) {
        Alert.alert(
          'Notifications Permission',
          'This app needs access to your push notifications',
          [
            {
              text: 'Ask me later',
              onPress: () => {
                navigate(EScreen.HOME);
              },
            },
            {
              text: 'Cancel',
              onPress: () => {
                navigate(EScreen.HOME);
              },
              style: 'cancel',
            },
            {text: 'OK', onPress: () => Linking.openSettings()},
          ],
        );
      }
    };

    setup();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const {uid} = remoteMessage.data || {};
      const notification = remoteMessage.notification;

      if (uid && notification) {
        setMuid(uid);
        setBody(notification.body);
      }
    });

    // Handle Notifications app quit

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        const {uid, userId} = remoteMessage?.data || {};
        if (uid) {
          handleNotify(uid, userId);
        }
      });

    return unsubscribe;
  }, [handleNotify]);

  const handleOk = useCallback(() => {
    const {uid, userId} = message || {};
    if (uid) {
      setMuid(undefined);
      handleNotify(uid, userId);
    }
  }, [handleNotify, message]);

  const handleQuit = useCallback(() => {
    setMuid(undefined);
  }, []);

  return {message, handleOk, handleQuit, body, uid: muid};
};

export default useNotify;
