import {PermissionsAndroid, Platform, Alert, Linking} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import Config from 'react-native-config';
import {Location, TAddress} from '@types';
import {CURRENT_LOCATION} from '@constants';
import {getAsyncStorage, setAsyncStorage} from './asyncStorage';

const GOOGLE_MAPS_API_KEY = Config.GOOGLE_MAPS_API_KEY;

const getLocationDetails = async ({latitude, longitude}: Location) => {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`,
  );

  const data = await res.json();
  const result = data.results.find(
    (item: any) => item.address_components.length === 3,
  );

  if (result) {
    const components = result.address_components;

    const district = components[0].long_name;
    const city = components[1].long_name;
    const nation = components[2].long_name;

    const address: TAddress = {
      district,
      city,
      nation,
      more: result.formatted_address,
    };

    return address;
  }
};

const getLocation = async (callback?: (location: any) => Promise<void>) => {
  Geolocation.getCurrentPosition(
    async position => {
      const {latitude, longitude} = position.coords;

      let current = await getAsyncStorage<Location>(CURRENT_LOCATION);
      if (current?.latitude !== latitude && current?.longitude !== longitude) {
        const data = await getLocationDetails({latitude, longitude});
        current = {
          latitude,
          longitude,
          description: data,
        };
        await setAsyncStorage(CURRENT_LOCATION, current);
      }

      callback && (await callback(current));
    },
    error => {
      console.log(error);
    },
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
  );
};

const requestLocationPermission = async ({
  onLocation,
  onDenyLocation,
}: {
  onLocation?: (location: any) => Promise<void>;
  onDenyLocation?: () => void;
} = {}) => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      await getLocation(onLocation);
    } else {
      Alert.alert(
        'Location Permission',
        'This app needs access to your location to show your current position on the map',
        [
          {
            text: 'Ask me later',
            onPress: () => {
              onDenyLocation && onDenyLocation();
            },
          },
          {
            text: 'Cancel',
            onPress: () => {
              onDenyLocation && onDenyLocation();
            },
            style: 'cancel',
          },
          {text: 'OK', onPress: () => Linking.openSettings()},
        ],
      );

      console.log('Location permission denied');
    }
  } else {
    await getLocation(onLocation);
  }
};

const fetchDistanceAndTime = async (
  {to, from}: {to: Location; from: Location},
  callback: (distance: string, timeout: string) => void,
) => {
  if (to && from) {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${from.latitude},${from.longitude}&destinations=${to.latitude},${to.longitude}&key=${GOOGLE_MAPS_API_KEY}`,
    );

    const data = await response.json();

    const d = data.rows[0].elements[0].distance.text;
    const t = data.rows[0].elements[0].duration.text;

    callback(d, t);
  }
};

export {requestLocationPermission, fetchDistanceAndTime};
