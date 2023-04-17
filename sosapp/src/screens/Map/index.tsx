import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useEffect, useCallback, useState} from 'react';
import MapView, {Circle, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
navigator.geolocation = require('react-native-geolocation-service');

import Geolocation from '@react-native-community/geolocation';
import {useNavigation} from '@react-navigation/native';
import {RootScreenNavigationProps} from '@navigation';
import {EScreen} from '@enums/EScreen';
import {useLocation} from '../../hooks';
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
// import MapViewDirections from 'react-native-maps-directions';
import {BLACK_COLOR} from '@theme/color';
import {CustomText} from '@components/common';
import CustomMarker from './components/CustomMarker';
import {Location} from '@types';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_APIKEY = 'API_KEY';
const query = {
  key: GOOGLE_MAPS_APIKEY,
  language: 'vn',
};

const MapScreen = () => {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.MAP>>();

  const {location, setLocation} = useLocation(state => state);

  const [toLocation, setToLocation] = useState<Location>();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  useEffect(() => {
    // Geolocation.getCurrentPosition(info => {
    //   const {latitude, longitude} = info.coords;
    //   setLocation(latitude, longitude, 'My Location');
    // });
  }, [setLocation]);

  const selectToLocation = useCallback(
    (data: GooglePlaceData, detail: GooglePlaceDetail | null) => {
      const _location = detail?.geometry?.location;
      if (_location) {
        const {lat, lng} = _location;
        setToLocation({latitude: lat, longitude: lng});
      }
    },
    [],
  );

  const selectFromLocation = useCallback(
    (data: GooglePlaceData, detail: GooglePlaceDetail | null) => {
      const _location = detail?.geometry?.location;
      if (_location) {
        const {lat, lng} = _location;
        setLocation(lat, lng);
      }
    },
    [setLocation],
  );

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <View style={styles.inputTitle}>
          <CustomText text="From" type="text_medium_24" />
          <CustomText text="Where to" type="text_medium_24" />
        </View>

        <View style={styles.inputSearch}>
          <GooglePlacesAutocomplete
            placeholder="type"
            styles={inputStyles}
            fetchDetails={true}
            onPress={selectFromLocation}
            currentLocation={true}
            textInputProps={{value: location?.lable}}
            query={query}
            enablePoweredByContainer={true}
            nearbyPlacesAPI="GooglePlacesSearch"
          />

          <GooglePlacesAutocomplete
            placeholder="type"
            styles={inputStyles}
            fetchDetails={true}
            onPress={selectToLocation}
            query={query}
            enablePoweredByContainer={true}
            nearbyPlacesAPI="GooglePlacesSearch"
          />
        </View>
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{...location, latitudeDelta: 0.005, longitudeDelta: 0.005}}>
        <MapViewDirections
          origin={location}
          destination={toLocation}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={8}
          strokeColor="#3A4C11"
        />
        {location && (
          <View>
            <CustomMarker
              coordinate={location}
              title="I'm here!"
              onChangeLocation={setLocation}
            />
            <Circle
              center={location}
              radius={500}
              fillColor="#42ff22"
              strokeWidth={2}
            />
          </View>
        )}
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  search: {
    position: 'absolute',
    top: 5,
    left: 2,
    right: 2,
    zIndex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: BLACK_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputTitle: {
    alignItems: 'flex-start',
    marginRight: 10,
    height: '100%',
    justifyContent: 'space-around',
  },
  inputSearch: {
    justifyContent: 'center',
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  bottomOption: {
    position: 'absolute',
    bottom: 80,
    right: 20,
  },
});

const inputStyles = StyleSheet.create({
  container: {
    flex: 0,
  },
  textInput: {
    fontSize: 18,
  },
});
