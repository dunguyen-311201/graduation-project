import {StyleSheet, View, PermissionsAndroid, Alert} from 'react-native';
import React, {useCallback, useContext, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import {RootScreenNavigationProps} from '@navigation';
import {EScreen} from '@enums';
import {ScreenBase, Card} from '@components';
import {GoMapIcon, SOSIcon} from '@theme';
import useAuth from '@hooks/useAuth';
import {Context} from '@context';
import {useUser} from '@hooks';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const HomeScreen = () => {
  const {navigate, setOptions, openDrawer} =
    useNavigation<RootScreenNavigationProps<EScreen.DRAWER>>();

  const {currentUser} = useAuth();

  const {setUserInfo} = useContext(Context);

  const {user} = useUser({uid: currentUser?.uid});

  useEffect(() => {
    setOptions({headerShown: false});
    setUserInfo(user);
  }, [setOptions, setUserInfo, user]);

  useEffect(() => {
    // PushNotification.configure({
    //   onNotification: function (notification: any) {
    //     console.log('NOTIFICATION:', notification);
    //     navigate(EScreen.DRAWER);
    //   },
    // });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Realtime subscription: ', remoteMessage);
      Alert.alert('Real', '123');
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      console.log('Notification: ', remoteMessage.data);
      if (remoteMessage.data) {
        navigate(EScreen.MAP, {initLocation: undefined});
      }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    return unsubscribe;
  }, [navigate]);

  const _navigationMap = useCallback(() => {
    navigate(EScreen.MAP, {});
  }, [navigate]);

  const _handleSendRescue = useCallback(() => {
    navigate(EScreen.SEND_DISTRESS_SIGNAL);
  }, [navigate]);

  return (
    <ScreenBase
      onOptions={openDrawer}
      desc={
        'Are you having problems with\nyour vehicle?\nImmediately connect to\nthe rescue service.'
      }>
      <View style={styles.options}>
        <Card icon={SOSIcon} title="Send rescue" onPress={_handleSendRescue} />
        <Card icon={GoMapIcon} title="Go to Map" onPress={_navigationMap} />
      </View>
    </ScreenBase>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
