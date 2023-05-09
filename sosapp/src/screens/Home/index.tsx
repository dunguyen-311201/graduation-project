import {View, Image, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {
  ScreenBase,
  Card,
  CustomText,
  CustomButton,
  SearchInput,
} from '@components';
import {EScreen} from '@enums';
import {MenuButton} from './components';
import {RootScreenNavigationProps} from '@navigation';
import {GoMapIcon, LIGHT_BLUE_COLOR, MapImage, SOSIcon} from '@theme';
import {getUser, handleOffLocation, handleOnLocation} from '@utils/user';

const HomeScreen = () => {
  const {navigate, openDrawer, setOptions} =
    useNavigation<RootScreenNavigationProps<EScreen.DRAWER>>();

  const [onLocation, setOnLocation] = useState(false);

  useEffect(() => {
    setOptions({headerShown: false});

    const setup = async () => {
      const user = await getUser();
      if (user?.location !== null) {
        setOnLocation(true);
        return;
      }
      setOnLocation(false);
    };

    setup();
  }, [setOptions]);

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
