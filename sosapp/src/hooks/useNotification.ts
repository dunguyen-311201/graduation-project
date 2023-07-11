import {Alert, Linking, PermissionsAndroid} from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {useCallback, useContext, useEffect, useState} from 'react';

import {Context} from '@context';
import {TNotification} from '@types';
import {rejectAssign} from '@utils';

const useNotification = () => {
  const [notify, setNotify] = useState<TNotification | null>(null);
  const {isAuthenticated} = useContext(Context);

  useEffect(() => {
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
              onPress: () => {},
            },
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {text: 'OK', onPress: () => Linking.openSettings()},
          ],
        );
      }
    };

    if (isAuthenticated) {
      setup();

      const unsubscribe = messaging().onMessage(async remoteMessage => {
        await handleNotification(remoteMessage);
      });

      messaging().setBackgroundMessageHandler(async mess => {
        return Alert.alert(
          'Notification',
          'Notification has been sent to the device via.',
        );
      });

      messaging()
        .getInitialNotification()
        .then(async remoteMessage => {
          await handleNotification(remoteMessage, true);
        });

      return unsubscribe;
    }
  }, [isAuthenticated]);

  const hideNotify = useCallback(() => {
    setNotify(null);
  }, []);

  const handleNotification = useCallback(
    async (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
      background?: boolean,
    ) => {
      const {id, tID} = remoteMessage?.data || {};
      const {body, title, android} = remoteMessage?.notification || {};

      if (id && body && title) {
        let mess: TNotification = {
          id,
          body,
          title,
          background,
          imageUrl: android?.imageUrl,
        };

        if (tID) {
          mess = {
            ...mess,
            onReject: async () => {
              await rejectAssign(tID);
              setNotify(null);
            },
          };
        }

        setNotify(mess);
      }
    },
    [],
  );

  return {notify, hideNotify};
};

export default useNotification;
