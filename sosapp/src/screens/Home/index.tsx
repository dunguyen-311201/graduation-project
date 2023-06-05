import {useNavigation} from '@react-navigation/native';
import {View, Image, StyleSheet} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';

import {getUserByID, requestLocationPermission} from '@utils';
import {
  ScreenBase,
  Card,
  CustomText,
  CustomButton,
  SearchInput,
  Loading,
  Notify,
} from '@components';
import {EScreen} from '@enums';
import {useNotifiCation} from '@hooks';
import {MenuButton} from './components';
import {RootScreenNavigationProps} from '@navigation';
import {GoMapIcon, LIGHT_BLUE_COLOR, MapImage, SOSIcon} from '@theme';
import {Context} from '@context';
import UpgradeForm from './components/UpgradeForm';

const HomeScreen = () => {
  const {navigate, openDrawer, setOptions} =
    useNavigation<RootScreenNavigationProps<EScreen.DRAWER>>();

  const {currentUser} = useContext(Context);

  const {message, handleQuit, handleOk, body} = useNotifiCation({
    navigate,
  });

  const [onLocation, setOnLocation] = useState(false);

  const [isVisible, setVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  requestLocationPermission();

  useEffect(() => {
    const setup = async () => {
      if (currentUser) {
        setLoading(true);
        const user = await getUserByID(currentUser.uid);
        if (user?.location) {
          setOnLocation(true);
        } else {
          setOnLocation(false);
        }

        setLoading(false);
      }
    };

    setOptions({headerShown: false});

    setup();
  }, []);

  let {displayName, uid, email, phoneNumber} = currentUser || {};

  const handleUpgrade = useCallback(() => {
    setVisible(true);
  }, []);

  const handleMap = useCallback(async () => {
    navigate(EScreen.MAP, {});
  }, []);

  const handleSendRescue = useCallback(() => {
    navigate(EScreen.SEND_DISTRESS_SIGNAL);
  }, []);

  const handleCloseModal = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <>
      {loading && <Loading />}
      {displayName && uid && phoneNumber && isVisible && (
        <UpgradeForm
          user={{displayName, uid, email, phoneNumber}}
          handleClose={handleCloseModal}
        />
      )}

      {/* Handle Show Notifications */}

      {message && (
        <Notify
          message={message}
          onOk={handleOk}
          onQuit={handleQuit}
          body={body}
        />
      )}

      {/* Handle Show Notifications */}

      <ScreenBase customStyle={styles.container} padding={1}>
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
            label={onLocation ? 'Upgrade' : 'Dropdown'}
            type="outline"
            onPress={handleUpgrade}
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
