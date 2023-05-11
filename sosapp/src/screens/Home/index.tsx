import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import React, {useCallback, useEffect, useState} from 'react';
import {View, Image, PermissionsAndroid, StyleSheet} from 'react-native';

import {
  ScreenBase,
  Card,
  CustomText,
  CustomButton,
  SearchInput,
  CustomModal,
} from '@components';
import {EScreen} from '@enums';
import {MenuButton} from './components';
import {useAuth, useMessage} from '@hooks';
import {RootScreenNavigationProps} from '@navigation';
import {GoMapIcon, LIGHT_BLUE_COLOR, MapImage, SOSIcon} from '@theme';
import {getUserByID, handleOffLocation, handleOnLocation} from '@utils';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const HomeScreen = () => {
  const {navigate, openDrawer, setOptions} =
    useNavigation<RootScreenNavigationProps<EScreen.DRAWER>>();

  const [onLocation, setOnLocation] = useState(false);

  const [uid, setUid] = useState<string>();
  const {message} = useMessage(uid);

  const {currentUser} = useAuth();

  useEffect(() => {
    setOptions({headerShown: false});

    const setup = async () => {
      if (currentUser !== null) {
        const user = await getUserByID(currentUser.uid);
        if (user) {
          const {location} = user;

          if (location) {
            setOnLocation(true);
            return;
          }
        }
      }
      setOnLocation(false);
    };

    setup();
  }, [currentUser, setOptions]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage?.data) {
        console.log(remoteMessage?.data);
        setUid(remoteMessage.data.uid);
      }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data) {
          console.log(remoteMessage?.data);
          navigate(EScreen.DETAIL_MESSAGE, {uid: remoteMessage.data.uid});
        }
      });

    return unsubscribe;
  }, []);

  const handleClose = useCallback(() => {
    setUid(undefined);
  }, []);

  const handleNotify = useCallback(() => {
    if (uid) {
      navigate(EScreen.DETAIL_MESSAGE, {uid});
      setUid(undefined);
    }
  }, [navigate, uid]);

  const handleMap = useCallback(() => {
    navigate(EScreen.MAP, {});
  }, [navigate]);

  const handleSendRescue = useCallback(() => {
    navigate(EScreen.SEND_DISTRESS_SIGNAL);
  }, [navigate]);

  const handleLocation = useCallback(async () => {
    if (onLocation) {
      handleOffLocation();
      setOnLocation(false);
      return;
    }

    handleOnLocation();
    setOnLocation(true);
  }, [onLocation]);

  console.log({message});

  return (
    <>
      {message && (
        <CustomModal
          title={message.type}
          description={message.description}
          isVisible={true}
          onClose={handleClose}
          onOk={handleNotify}
        />
      )}
      <ScreenBase customStyle={styles.container} padding>
        <View style={styles.homeHeader}>
          <MenuButton onPress={openDrawer} marginTop={32} />
          <CustomText
            text={
              'Are you having your\nproblems with vehicle?\nImmediately connect to\nthe rescue service.'
            }
            type="text_medium_30"
            customStyle={styles.title}
          />
          <CustomButton
            label={`Turn ${onLocation ? 'off' : 'on'} location`}
            type="outline"
            onPress={handleLocation}
          />
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
    </>
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
