import {Alert, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

import {RootScreenNavigationProps} from '@navigation';

import {EScreen} from '@enums';
import {ScreenBase, Card} from '@components';
import {GoMapIcon, SOSIcon} from '@theme';

const HomeScreen = () => {
  const {navigate, setOptions} =
    useNavigation<RootScreenNavigationProps<EScreen.DRAWER>>();

  useEffect(() => {
    // setOptions({headerShown: false});
  }, [setOptions]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
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
      title={
        'To find your pickup\nlocation\nautomatically, turn \non location services'
      }>
      <View style={styles.options}>
        <Card icon={SOSIcon} title="Send rescue" onPress={_handleSendRescue} />
        <Card icon={GoMapIcon} title="Go to Map" onPress={_navigationMap} />
        <Card
          icon={SOSIcon}
          title="Emergency rescue"
          onPress={_navigationMap}
        />
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
