import {Alert, Linking, PermissionsAndroid} from 'react-native';
import {
  getInitialNotification,
  onMessage,
  requestPermission,
} from '@react-native-firebase/messaging';
import type {RemoteMessage} from '@react-native-firebase/messaging';
import {messaging} from '@services';
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

      await requestPermission(messaging);

      if (granted === PermissionsAndroid.RESULTS.DENIED) {
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

      const unsubscribe = onMessage(messaging, async remoteMessage => {
        await handleNotification(remoteMessage);
      });

      // The background handler is registered once in index.ts (it must run
      // outside React, before the app component mounts).
      getInitialNotification(messaging).then(async remoteMessage => {
        await handleNotification(remoteMessage, true);
      });

      return unsubscribe;
    }
  }, [isAuthenticated]);

  const hideNotify = useCallback(() => {
    setNotify(null);
  }, []);

  const handleNotification = useCallback(
    async (remoteMessage: RemoteMessage | null, background?: boolean) => {
      // FCM data values are strings; the server sends the message id and
      // optional assignment id (tID).
      const data = remoteMessage?.data || {};
      const id = typeof data.id === 'string' ? data.id : undefined;
      const tID = typeof data.tID === 'string' ? data.tID : undefined;
      const {body, title, android} = remoteMessage?.notification || {};

      if (id && body && title) {
        let mess: TNotification = {
          id,
          body,
          title,
          background,
          time: Date.now(),
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
