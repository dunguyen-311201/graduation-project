import {Dimensions, StyleSheet, View, Image, Pressable} from 'react-native';
import React, {useEffect, useCallback, useState} from 'react';
import MapView, {Circle, PROVIDER_GOOGLE} from 'react-native-maps';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {RootScreenNavigationProps} from '@navigation';
import {EScreen} from '@enums';
import {Location} from '@types';
import {
  FromLocationIcon,
  ToLocationIcon,
  ClearInputIcon,
  TEXT_COLOR,
} from '@theme';
import SearchInput from './components/SearchInput';
import {useDeviceLocation} from '@hooks';
import CustomMarker from './components/CustomMarker';
import MapViewDirections from 'react-native-maps-directions';
import Config from 'react-native-config';
import {BackIcon, CustomText} from '@components';
import {RootParamList} from '@navigation/RootNavigation';

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

  const {deviceLocation} = useDeviceLocation();

  const [locations, setLocations] = useState<SearchLocation>();

  useEffect(() => {
    setOptions({headerShown: false});
    if (initLocation) {
      setLocations({to: initLocation, from: deviceLocation});
    }
  }, [deviceLocation, initLocation, setOptions]);

  useEffect(() => {
    setLocations({from: deviceLocation});
  }, [deviceLocation]);

  const {from, to, distance, timeout} = locations || {};

  useEffect(() => {
    const getDistance = async () => {
      const [des1, des2] = [from?.description, to?.description];

      if (des1 && des2) {
        const URL = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${from?.description}&origins=${to?.description}&units=imperial&key=${GOOGLE_MAPS_API_KEY}`;
        fetch(URL)
          .then(response => response.json())
          .then(data => {
            const cal = data?.rows[0].elements[0];
            const d = Math.round(cal.distance.value / 1000);
            const t = cal.duration.text;
            setLocations(prev => ({...prev, distance: d, timeout: t}));
          })
          .catch(error => {
            console.log(error);
          });
      }
    };

    getDistance();
  }, [from?.description, to?.description]);

  const handleSearch = useCallback((_location: Location, _field?: string) => {
    if (_field === 'to') {
      setLocations(prev => ({...prev, to: _location}));
    }
    if (_field === 'from') {
      setLocations(prev => ({...prev, from: _location}));
    }
  }, []);

  const handleToDirectionandSearch = useCallback(() => {
    setIsDirection(prev => !prev);
  }, []);

  const handleChangeLocation = useCallback(() => {}, []);

  return (
    <View style={styles.container}>
      {!isDirection ? (
        <View style={[styles.navbar, styles.single]}>
          <View style={styles.iconBack}>
            <BackIcon onPress={goBack} />
          </View>
          <SearchInput
            origin={from}
            onSearch={handleSearch}
            placeholder="Search"
            field="from"
            onToDirection={handleToDirectionandSearch}
            isDirection={isDirection}
          />
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
              customStyle={styles.inputFirstItem}
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
            />
          </View>
          <View style={styles.distanceInfo}>
            <Pressable onPress={handleToDirectionandSearch}>
              <Image source={ClearInputIcon} style={styles.icon} />
            </Pressable>
            {timeout && (
              <CustomText text={timeout} type="text_small_light_blue_5_14" />
            )}
            {distance && (
              <CustomText
                text={distance + ' km'}
                type="text_small_light_blue_5_14"
              />
            )}
          </View>
        </View>
      )}

      {from && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{...from, latitudeDelta: 0.009, longitudeDelta: 0.009}}>
          {from && to && GOOGLE_MAPS_API_KEY && (
            <MapViewDirections
              origin={from}
              destination={to}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={8}
              strokeColor="#3A4C11"
            />
          )}
          {from && (
            <View>
              <CustomMarker
                coordinate={from}
                title={to ? 'Begin' : 'Location'}
                field="from"
                onChangeLocation={handleChangeLocation}
              />
              <Circle
                center={from}
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
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    minHeight: 80,
    width: '100%',
    position: 'absolute',
    backgroundColor: TEXT_COLOR,
    zIndex: 2,
  },
  single: {
    width: '100%',
    height: 80,
    flexDirection: 'column',
    position: 'absolute',
    backgroundColor: TEXT_COLOR,
  },
  direction: {minHeight: 150},
  iconBack: {position: 'absolute', top: 30, left: 10},
  group: {
    flex: 1,
  },
  lastItem: {
    top: '50%',
  },
  inputFirstItem: {
    zIndex: 2,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 20,
  },
  distanceInfo: {
    height: '100%',
    maxWidth: 80,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
});
