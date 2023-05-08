import {StyleSheet, View, PermissionsAndroid, Image} from 'react-native';
import React, {useCallback, useContext, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import {RootScreenNavigationProps} from '@navigation';
import {EScreen} from '@enums';
import {
  ScreenBase,
  Card,
  CustomText,
  CustomButton,
  SearchInput,
} from '@components';
import {GoMapIcon, LIGHT_BLUE_COLOR, MapImage, SOSIcon} from '@theme';
import {Context} from '@context';
import {MenuButton} from './components';
// import {useMessage} from '@hooks';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const HomeScreen = () => {
  const {navigate, openDrawer, setOptions} =
    useNavigation<RootScreenNavigationProps<EScreen.DRAWER>>();

  // const {message} = useMessage('');

  const {
    setInitRoute,
    initRoute,
    setIsVisibleNotification,
    isVisibleNotification,
  } = useContext(Context);

  useEffect(() => {
    setOptions({headerShown: false});

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Realtime subscription: ', remoteMessage);
      navigate(EScreen.MAP, {});
    });

    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   console.log('Message handled in the background!', remoteMessage);
    // });

    // messaging().onNotificationOpenedApp(remoteMessage => {
    //   console.log(
    //     'Notification caused app to open from background state:',
    //     remoteMessage,
    //   );
    //   console.log({isVisibleNotification});
    //   setIsVisibleNotification(true);
    // });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.data,
          );
          navigate(EScreen.MAP, {});
        }
      });

    return unsubscribe;
  }, [
    initRoute,
    isVisibleNotification,
    navigate,
    setInitRoute,
    setIsVisibleNotification,
    setOptions,
  ]);

  const handleMap = useCallback(() => {
    navigate(EScreen.MAP, {});
  }, [navigate]);

  const handleSendRescue = useCallback(() => {
    navigate(EScreen.SEND_DISTRESS_SIGNAL);
  }, [navigate]);

  return (
    <ScreenBase customStyle={styles.container}>
      <View style={styles.homeHeader}>
        <MenuButton onPress={openDrawer} marginTop={32} />
        <CustomText
          text={
            'Are you having your\nproblems with vehicle?\nImmediately connect to\nthe rescue service.'
          }
          type="text_medium_30"
          customStyle={styles.title}
        />
        <CustomButton label="Turn on location" type="outline" />
      </View>
      <View style={styles.options}>
        <Card icon={SOSIcon} title="Rescue" onPress={handleSendRescue} />
        <Card icon={GoMapIcon} title="Map" onPress={handleMap} />
      </View>
      <View>
        <View style={styles.map}>
          <SearchInput
            placeholder="Enter pickup location"
            field="from"
            isDirection
            onSearch={handleMap}
          />
          <CustomText
            text="Around you"
            type="text_medium_20"
            customStyle={styles.mapTitle}
          />
          <Image source={MapImage} />
        </View>
      </View>
    </ScreenBase>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  homeHeader: {
    backgroundColor: LIGHT_BLUE_COLOR,
    paddingHorizontal: 32,
    paddingBottom: 34,
  },
  title: {
    marginTop: 33,
    marginBottom: 27,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingHorizontal: 32,
    paddingTop: 30,
  },
  map: {
    marginHorizontal: 32,
    marginTop: 23,
    paddingTop: 70,
    paddingBottom: 30,
    position: 'relative',
    zIndex: 1,
  },
  mapTitle: {marginBottom: 10},
});
