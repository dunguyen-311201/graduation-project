import MapView, {
  Circle,
  PROVIDER_GOOGLE,
  enableLatestRenderer,
} from 'react-native-maps';
import Config from 'react-native-config';
import MapViewDirections from 'react-native-maps-directions';
import React, {useEffect, useCallback, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Dimensions, StyleSheet, View, Image, Pressable} from 'react-native';

enableLatestRenderer();

import {
  FromLocationIcon,
  ToLocationIcon,
  CloseIcon,
  TEXT_COLOR,
  WHITE_COLOR,
} from '@theme';
import {EScreen} from '@enums';
import {Location} from '@types';
import {useAuth, useNotifiCation} from '@hooks';
import {CustomMarker} from './components';
import {CURRENT_LOCATION} from '@constants';
import {RootScreenNavigationProps} from '@navigation';
import {RootParamList} from '@navigation/RootNavigation';
import {
  fetchDistanceAndTime,
  getAsyncStorage,
  requestLocationPermission,
} from '@utils';
import {BackIcon, CustomText, Notify, SearchInput} from '@components';

const GOOGLE_MAPS_API_KEY = Config.GOOGLE_MAPS_API_KEY;

type SearchLocation = {
  from?: Location;
  to?: Location;
  distance?: string;
  timeout?: string;
};

type ConfirmRoute = RouteProp<RootParamList, EScreen.MAP>;

const MapScreen = () => {
  const {setOptions, goBack, navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.MAP>>();

  const {message, handleQuit, handleOk, body} = useNotifiCation({
    navigate,
  });

  const {currentUser} = useAuth();

  const {from, to} = useRoute<ConfirmRoute>().params || {};

  const [isDirection, setIsDirection] = useState(false);

  const [locations, setLocations] = useState<SearchLocation>();

  requestLocationPermission();

  useEffect(() => {
    setOptions({headerShown: false});
  }, []);

  useEffect(() => {
    const setup = async () => {
      if (currentUser) {
        const cacheLocation = await getAsyncStorage<Location>(CURRENT_LOCATION);

        if (cacheLocation) {
          setLocations({
            from: from || cacheLocation,
            ...(to && {to}),
          });
        }
      }
    };
    setup();
  }, [currentUser, from, to]);

  useEffect(() => {
    const _to = locations?.to;
    const _from = locations?.from;
    if (_to && _from) {
      fetchDistanceAndTime(
        {to: _to, from: _from},
        (distance: string, timeout: string) =>
          setLocations({
            ...locations,
            distance,
            timeout,
          }),
      );
    }
  }, [locations]);

  const handleSearch = useCallback(
    async (_location: Location, _field?: string) => {
      if (_field === 'to') {
        setLocations(prev => ({...prev, to: _location}));
      }
      if (_field === 'from') {
        setLocations(prev => ({...prev, from: _location}));
      }
    },
    [],
  );

  const handleToDirectionandSearch = useCallback(() => {
    setIsDirection(prev => !prev);
  }, []);

  const handleChangeLocation = useCallback(() => {}, []);

  return (
    <>
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
      <View style={styles.container}>
        {!isDirection ? (
          <View style={styles.navbar}>
            <View style={styles.iconBack}>
              <BackIcon onPress={goBack} />
            </View>
            <View style={styles.single}>
              <SearchInput
                origin={locations?.from}
                onSearch={handleSearch}
                placeholder="Search"
                field="from"
                onToDirection={handleToDirectionandSearch}
                isDirection={isDirection}
              />
            </View>
          </View>
        ) : (
          <View style={[styles.navbar, styles.direction]}>
            <View style={styles.group}>
              <SearchInput
                origin={locations?.from}
                icon={FromLocationIcon}
                onSearch={handleSearch}
                placeholder="From"
                field="from"
                onToDirection={handleToDirectionandSearch}
                isDirection={isDirection}
                zIndex={3}
              />
              <SearchInput
                icon={ToLocationIcon}
                onSearch={handleSearch}
                placeholder="Where to"
                origin={locations?.to}
                field="to"
                onToDirection={handleToDirectionandSearch}
                isDirection={isDirection}
                customStyle={styles.lastItem}
                zIndex={2}
              />
            </View>
            <View style={styles.navRight}>
              <Pressable onPress={handleToDirectionandSearch}>
                <Image source={CloseIcon} style={styles.icon} />
              </Pressable>
            </View>
          </View>
        )}

        {locations?.from && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              ...locations?.from,
              latitudeDelta: 0.009,
              longitudeDelta: 0.009,
            }}>
            {locations?.to && GOOGLE_MAPS_API_KEY && (
              <MapViewDirections
                origin={locations?.from}
                destination={locations?.to}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeWidth={8}
                strokeColor="#3A4C11"
              />
            )}
            <View>
              <CustomMarker
                coordinate={locations.from}
                title={locations?.to ? 'Begin' : 'Location'}
                field="from"
                onChangeLocation={handleChangeLocation}
              />
              <Circle
                center={locations.from}
                radius={500}
                fillColor="#42ff22"
                strokeWidth={2}
              />
            </View>
            {locations?.to && (
              <View>
                <CustomMarker
                  coordinate={locations.to}
                  title="End"
                  field="from"
                  onChangeLocation={handleChangeLocation}
                />
                <Circle
                  center={locations.to}
                  radius={500}
                  fillColor="#42ff22"
                  strokeWidth={2}
                />
              </View>
            )}
          </MapView>
        )}
        {locations?.distance && (
          <View style={styles.distanceInfo}>
            {locations?.timeout && (
              <CustomText
                text={`Time: ${locations?.timeout}`}
                type="text_medium_16"
                color="blue"
              />
            )}
            {locations?.distance && (
              <CustomText
                text={`Distance: ${locations.distance} km`}
                type="text_medium_16"
                color="blue"
              />
            )}
          </View>
        )}
      </View>
    </>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  navbar: {
    zIndex: 2,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: TEXT_COLOR,
    width: '100%',
    height: 80,
  },
  navRight: {
    paddingTop: 20,
  },
  single: {
    flex: 1,
    flexDirection: 'column',
    position: 'absolute',
    right: 40,
    left: 40,
    backgroundColor: TEXT_COLOR,
    zIndex: 3,
  },
  direction: {minHeight: 150, paddingLeft: 40},
  iconBack: {
    position: 'absolute',
    top: 30,
    left: 10,
    zIndex: 4,
  },
  group: {
    flex: 1,
  },
  lastItem: {
    top: '50%',
  },

  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 20,
  },
  distanceInfo: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: WHITE_COLOR,
    borderRadius: 10,
    flexDirection: 'row',
    bottom: 20,
    left: 20,
    right: 20,
    height: 50,
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});
