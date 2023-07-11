import {
  BellIcon,
  GoMapIcon,
  LIGHT_BLUE_COLOR,
  MWorkerIcon,
  MapImage,
  MessageIcon,
  SOSIcon,
} from '@theme';
import {
  Card,
  CustomButton,
  CustomText,
  MenuButton,
  ScreenBase,
  SearchInput,
} from '@components';
import {ERole, EScreen} from '@enums';
import {Image, StyleSheet, View} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {getAsyncStorage, requestLocationPermission} from '@utils';

import {CURRENT_LOCATION} from '@constants';
import {Context} from '@context';
import {Location} from '@types';
import {RootScreenNavigationProps} from '@navigation';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const {navigate, openDrawer} =
    useNavigation<RootScreenNavigationProps<EScreen.DRAWER>>();

  const {currentUser} = useContext(Context);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setup = async () => {
      const cacheLocation = await getAsyncStorage<Location>(CURRENT_LOCATION);
      cacheLocation && setLocation(cacheLocation);
    };

    setup();
  }, []);

  const handleTurnOnLocation = useCallback(async () => {
    setLoading(true);
    await requestLocationPermission();
    const cacheLocation = await getAsyncStorage<Location>(CURRENT_LOCATION);
    cacheLocation && setLocation(cacheLocation);
    setLoading(false);
  }, []);

  const handleMap = useCallback(async () => {
    navigate(EScreen.MAP);
  }, []);

  const handleManagementWorker = useCallback(() => {
    navigate(EScreen.WORKER);
  }, []);

  const handleNotify = useCallback(() => {
    navigate(EScreen.NOTIFICATION);
  }, []);

  const handleRequests = useCallback(() => {
    navigate(EScreen.MESSAGES, {mode: true});
  }, []);

  return (
    <ScreenBase customStyle={styles.container} padding={1} loading={loading}>
      <View style={styles.header}>
        <View style={styles.content}>
          <View style={styles.nav}>
            <MenuButton onPress={openDrawer} />
            <CustomButton
              icon={BellIcon}
              onPress={handleNotify}
              type="secondary"
            />
          </View>
          <CustomText
            text={
              'Are you having your problems with vehicle? Immediately connect to the rescue service.'
            }
            type="text_medium_30"
            customStyle={styles.title}
          />
          <CustomButton
            label={location ? 'Location is on' : 'Turn on location'}
            type="outline"
            onPress={handleTurnOnLocation}
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.options}>
          {currentUser?.role === ERole.USER && (
            <Card icon={SOSIcon} title="Rescue" onPress={handleRequests} />
          )}

          {currentUser?.role === ERole.CENTER && (
            <Card
              icon={MWorkerIcon}
              title="Workers"
              onPress={handleManagementWorker}
            />
          )}

          {currentUser?.role === ERole.WORKER && (
            <Card
              icon={MessageIcon}
              title="Requests"
              onPress={handleRequests}
            />
          )}

          <Card icon={GoMapIcon} title="Map" onPress={handleMap} />
        </View>
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
    flex: 1,
  },
  header: {
    backgroundColor: LIGHT_BLUE_COLOR,
    paddingBottom: 34,
    width: '100%',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    marginTop: 33,
    marginBottom: 27,
  },
  content: {
    paddingTop: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingTop: 30,
    width: '100%',
  },
  map: {
    marginTop: 23,
    paddingTop: 70,
    paddingBottom: 30,
    position: 'relative',
    zIndex: 1,
  },
  mapTitle: {marginBottom: 10},
});
