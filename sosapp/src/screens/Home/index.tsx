import {Alert, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
// import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

import {RootScreenNavigationProps} from '@navigation';

import {EScreen} from '@enums';
import {ScreenBase, Card} from '@components';
import {GoMapIcon, SOSIcon} from '@theme';

import {PermissionsAndroid} from 'react-native';
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const HomeScreen = () => {
  const {navigate, setOptions} =
    useNavigation<RootScreenNavigationProps<EScreen.DRAWER>>();

  useEffect(() => {
    // setOptions({headerShown: false});
  }, [setOptions]);

  useEffect(() => {
    const getToken = async () => {
      const token = await messaging().getToken();
      console.log('Token: ', token);
    };

    getToken();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    return unsubscribe;
  }, []);

  const _navigationMap = useCallback(() => {
    navigate(EScreen.MAP);
  }, [navigate]);

  const _handleSendRescue = useCallback(() => {
    navigate(EScreen.SEND_DISTRESS_SIGNAL);
  }, [navigate]);

  const send = useCallback(async () => {
    // Get the device token for the user's device
    // const deviceToken =
    //   'fuh8r-M9S6a_bID5TwXnSe:APA91bEMORPqJybfYJKpNxioWzsFmaTsVijtMqjumwXaATt796RYi_OQyCJzOVltHkiBMEhhnsiNFXHn33oFS_T7cfE2GukaYmoXRqpqGv6HpPsZe0mq5u9ViZ4sxqvwgfiwW2n2qDx7';
    // Construct the message payload
    // const message = {
    //   data: {
    //     title: 'Hello',
    //     body: 'This is a test notification',
    //   },
    //   token: deviceToken,
    // };
    // Send the message to the device
    // messaging()
    //   .send(message)
    //   .then(() => console.log('Notification sent successfully'))
    //   .catch(error => console.log('Error sending notification:', error));
    // await onUserPictureLiked('JTueZtGJaKEeOqZ7HxeK', 'akV8hskEqu5dWWiAvt00');
  }, []);

  return (
    <ScreenBase
      title={
        'To find your pickup\nlocation\nautomatically, turn \non location services'
      }>
      <View style={styles.options}>
        <Card icon={SOSIcon} title="Send rescue" onPress={_handleSendRescue} />
        <Card icon={GoMapIcon} title="Go to Map" onPress={_navigationMap} />
        <Card icon={SOSIcon} title="Send" onPress={send} />
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
