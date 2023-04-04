import {Dimensions, StyleSheet, View} from 'react-native';
import React from 'react';
import MapView, {Circle, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const GOOGLE_MAPS_APIKEY = 'AIzaSyCxMk5DpzvJT7eIumILFD_bG65iJ1vOuxI';

const origin = {latitude: 37.3318456, longitude: -122.0296002};
const destination = {latitude: 37.771707, longitude: -122.4053769};

const MapScreen = () => {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}>
      <MapViewDirections
        origin={origin}
        destination={destination}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={30}
        strokeColor="hotpink"
      />
      <Marker coordinate={origin} title="I'm here!" />
      <Circle
        center={destination}
        radius={1000}
        fillColor="red"
        strokeColor="blue"
        strokeWidth={2}
      />
    </MapView>
    // <View style={styles.map}>
    //   <GooglePlacesAutocomplete
    //     placeholder="Type places..."
    //     query={{key: {GOOGLE_MAPS_APIKEY}, language: 'en'}}
    //     minLength={2}
    //     onPress={(data, details = null) => {
    //       console.log(data, details);
    //     }}
    //   />
    // </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
