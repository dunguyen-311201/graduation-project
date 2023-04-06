import {Dimensions, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import MapView, {Circle, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';

import Geolocation from '@react-native-community/geolocation';
import {useNavigation} from '@react-navigation/native';
import {StackScreenNavigationProps} from '@navigation';
import {EScreen} from '@enums/EScreen';
import {useLocation} from '../../hooks';

// const GOOGLE_MAPS_APIKEY = 'AIzaSyCxMk5DpzvJT7eIumILFD_bG65iJ1vOuxI';

// const origin = {latitude: 37.3318456, longitude: -122.0296002};
// const destination = {latitude: 37.771707, longitude: -122.4053769};

const MapScreen = () => {
  const {setOptions, navigate} =
    useNavigation<StackScreenNavigationProps<EScreen.MAP>>();

  const {location, setLocation} = useLocation(state => state);

  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      const {latitude, longitude} = info.coords;
      setLocation({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    });

    setOptions({headerShown: false});
  }, [navigate, setLocation, setOptions]);

  return (
    <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={location}>
      {/* <MapViewDirections
        origin={origin}
        destination={destination}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={30}
        strokeColor="hotpink"
      /> */}
      <Marker coordinate={location} title="I'm here!" />
      <Circle
        center={location}
        radius={10}
        fillColor="#2091EB"
        strokeWidth={0}
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
