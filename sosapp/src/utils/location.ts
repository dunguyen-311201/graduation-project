import DeviceInfo from 'react-native-device-info';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {PermissionsAndroid, Platform, Alert, Linking} from 'react-native';

import Config from 'react-native-config';
import {Location} from '@types';
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

    const district = components?.at(-3).long_name;
    const city = components?.at(-2).long_name;
    const nation = components?.at(-1).long_name;

    console.log({district, city, nation, a: components?.at(-4).long_name});

    const lo: Location = {
      latitude,
      longitude,
      city,
      description: result.formatted_address,
    };

    return lo;
  }
};

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    let current = await getAsyncStorage<Location>(CURRENT_LOCATION);

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      if (await DeviceInfo.isEmulator()) {
        await setAsyncStorage(CURRENT_LOCATION, {
          latitude: 16.0544563,
          longitude: 108.0717219,
          city: 'Da Nang',
          description: 'Da Nang, Vietnam',
        });
        return;
      }

      const position: GeolocationResponse = await new Promise(
        (resolve, reject) => {
          Geolocation.getCurrentPosition(resolve, reject);
        },
      );

      const {latitude, longitude} = position.coords;

      if (
        (current &&
          Math.abs(current.latitude - latitude) > 0.001 &&
          Math.abs(current.longitude - longitude) > 0.001) ||
        current === null
      ) {
        const location = await getLocationDetails({latitude, longitude});
        location && (await setAsyncStorage(CURRENT_LOCATION, location));
      }
    } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
      Alert.alert(
        'Location Permission',
        'This app needs access to your location to show your current position on the map',
        [
          {
            text: 'Ask me later',
            onPress: () => {},
          },
          {text: 'Setting', onPress: () => Linking.openSettings()},
        ],
      );
    }
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

export {requestLocationPermission, getLocationDetails, fetchDistanceAndTime};
