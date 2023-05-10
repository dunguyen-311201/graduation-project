import Config from 'react-native-config';
import MapViewDirections from 'react-native-maps-directions';
import React, {useEffect, useCallback, useState} from 'react';
import MapView, {Circle, PROVIDER_GOOGLE} from 'react-native-maps';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Dimensions, StyleSheet, View, Image, Pressable} from 'react-native';

import {
  FromLocationIcon,
  ToLocationIcon,
  ClearInputIcon,
  TEXT_COLOR,
  WHITE_COLOR,
} from '@theme';
import {EScreen} from '@enums';
import {Location} from '@types';
import {CustomMarker} from './components';
import {RootScreenNavigationProps} from '@navigation';
import {RootParamList} from '@navigation/RootNavigation';
import {BackIcon, CustomText, SearchInput} from '@components';
import {getAsyncStorage} from '@utils/asyncStorage';
import {CURRENT_LOCATION} from '@constants/cache';

const GOOGLE_MAPS_API_KEY = Config.GOOGLE_MAPS_API_KEY;

type SearchLocation = {
  from?: Location;
  to?: Location;
  distance?: number;
  timeout?: string;
};

type ConfirmRoute = RouteProp<RootParamList, EScreen.MAP>;

const MapScreen = () => {
  const {setOptions, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.MAP>>();

  const {initLocation} = useRoute<ConfirmRoute>().params;

  const [isDirection, setIsDirection] = useState(false);

  const [locations, setLocations] = useState<SearchLocation>();

  useEffect(() => {
    setOptions({headerShown: false});

    const setup = async () => {
      const deviceLocation = await getAsyncStorage<Location>(CURRENT_LOCATION);

      if (deviceLocation !== null) {
        setLocations({from: deviceLocation});
      }
    };

    setup();

    if (initLocation) {
      setLocations({to: initLocation});
    }
  }, [setOptions, initLocation]);

  const {from, to, distance, timeout} = locations || {};

  useEffect(() => {
    const fetchDistanceAndTime = async () => {
      if (to && from) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${from.latitude},${from.longitude}&destinations=${to.latitude},${to.longitude}&key=${GOOGLE_MAPS_API_KEY}`,
        );

        const data = await response.json();

        console.log(74, data.rows[0]);

        const d = data.rows[0].elements[0].distance.text;
        const t = data.rows[0].elements[0].duration.text;

        setLocations(prev => ({...prev, distance: d, timeout: t}));
      }
    };

    fetchDistanceAndTime();
  }, [from, to]);

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
    <View style={styles.container}>
      {!isDirection ? (
        <View style={styles.navbar}>
          <View style={styles.iconBack}>
            <BackIcon onPress={goBack} />
          </View>
          <View style={styles.single}>
            <SearchInput
              origin={from}
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
              origin={from}
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
              origin={to}
              field="to"
              onToDirection={handleToDirectionandSearch}
              isDirection={isDirection}
              customStyle={styles.lastItem}
              zIndex={2}
            />
          </View>
          <View style={styles.navRight}>
            <Pressable onPress={handleToDirectionandSearch}>
              <Image source={ClearInputIcon} style={styles.icon} />
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
          {from && to && GOOGLE_MAPS_API_KEY && (
            <MapViewDirections
              origin={from}
              destination={to}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={8}
              strokeColor="#3A4C11"
            />
          )}
          {locations?.from && (
            <View>
              <CustomMarker
                coordinate={locations?.from}
                title={to ? 'Begin' : 'Location'}
                field="from"
                onChangeLocation={handleChangeLocation}
              />
              <Circle
                center={locations?.from}
                radius={500}
                fillColor="#42ff22"
                strokeWidth={2}
              />
            </View>
          )}
          {to && (
            <View>
              <CustomMarker
                coordinate={to}
                title="End"
                field="from"
                onChangeLocation={handleChangeLocation}
              />
              <Circle
                center={to}
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
          {timeout && (
            <CustomText
              text={`Time: ${timeout}`}
              type="text_medium_16"
              color="blue"
            />
          )}
          {distance && (
            <CustomText
              text={`Distance: ${distance} km`}
              type="text_medium_16"
              color="blue"
            />
          )}
        </View>
      )}
    </View>
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
