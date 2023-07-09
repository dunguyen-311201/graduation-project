import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {useState, useEffect, useCallback} from 'react';
import {PermissionsAndroid, Alert, Linking} from 'react-native';

import {rejectAssign} from '@utils';
import {TNotification} from '@types';

const useNotification = () => {
  const [notify, setNotify] = useState<TNotification | null>(null);

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

    setup();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Notification');
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
  }, []);

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
