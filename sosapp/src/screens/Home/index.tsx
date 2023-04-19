import {StyleSheet, View, PermissionsAndroid} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import {RootScreenNavigationProps} from '@navigation';
import {EScreen} from '@enums';
import {ScreenBase, Card} from '@components';
import {GoMapIcon, SOSIcon} from '@theme';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const HomeScreen = () => {
  const {navigate, setOptions, openDrawer} =
    useNavigation<RootScreenNavigationProps<EScreen.DRAWER>>();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  useEffect(() => {
    messaging()
      .getToken()
      .then(token => {
        console.log(token);
      });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Realtime subscription: ', remoteMessage);
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
