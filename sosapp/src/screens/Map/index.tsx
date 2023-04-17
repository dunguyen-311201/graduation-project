import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {Circle, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';

import Geolocation from '@react-native-community/geolocation';
import {useNavigation} from '@react-navigation/native';
import {RootScreenNavigationProps} from '@navigation';
import {EScreen} from '@enums/EScreen';
import {useLocation} from '../../hooks';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import {BLACK_COLOR} from '@theme/color';
import {CustomText} from '@components/common';
import CustomMarker from './components/CustomMarker';

const GOOGLE_MAPS_APIKEY = 'AIzaSyB1KoK7KQe0YzwScTNjC71HRS17my056bk'; //'AIzaSyBN9oFyb8tZu1zHzUcE1cMR4--NCOucmOM';

// const origin = {latitude: 37.3318456, longitude: -122.0296002};
// const destination = {latitude: 37.771707, longitude: -122.4053769};

const MapScreen = () => {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.MAP>>();

  const {location, setLocation} = useLocation(state => state);

  // const [location, setLocation] = useState<Location>();

  console.log(location);

  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      const {latitude, longitude} = info.coords;
      setLocation({
        latitude,
        longitude,
      });
    });

    setOptions({headerShown: false});
  }, [navigate, setLocation, setOptions]);

  return (
    <View style={styles.container}>
      {/* <View style={styles.search}>
        <View style={styles.inputTitle}>
          <CustomText text="From" type="text_medium_24" />
          <CustomText text="Where to" type="text_medium_24" />
        </View>

        <View style={styles.inputSearch}>
          <GooglePlacesAutocomplete
            placeholder="Type places..."
            query={{key: {GOOGLE_MAPS_APIKEY}, language: 'en'}}
            minLength={2}
            onPress={(data, details = null) => {
              console.log(data, details);
            }}
          />
          <GooglePlacesAutocomplete
            placeholder="Type places..."
            query={{key: {GOOGLE_MAPS_APIKEY}, language: 'en'}}
            minLength={2}
            onPress={(data, details = null) => {
              console.log(data, details);
            }}
          />
        </View>
      </View> */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{...location, latitudeDelta: 0.005, longitudeDelta: 0.005}}>
        {/* <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={30}
          strokeColor="hotpink"
        /> */}
        {location && (
          <View>
            <CustomMarker
              coordinate={location}
              title="I'm here!"
              onChangeLocation={setLocation}
            />
            <Circle
              center={location}
              radius={10}
              fillColor="#2091EB"
              strokeWidth={0}
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
});
