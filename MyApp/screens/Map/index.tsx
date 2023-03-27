import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const origin = {latitude: 37.3318456, longitude: -122.0296002};
const destination = {latitude: 37.771707, longitude: -122.4053769};
const GOOGLE_MAPS_APIKEY = 'AIzaSyDXdE5FLHKOkYsnfT-0j4UCC1ow1HNrWE0';

const MapScreen = () => {
  return (
    <MapView
      provider="google"
      style={styles.map}
      //   region={{
      //     latitude: 37.78825,
      //     longitude: -122.4324,
      //     latitudeDelta: 0.015,
      //     longitudeDelta: 0.0121,
      //   }}
    >
      <MapViewDirections
        origin={origin}
        destination={destination}
        apikey={GOOGLE_MAPS_APIKEY}
      />
    </MapView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
