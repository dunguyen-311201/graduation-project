import {Alert, Linking} from 'react-native';
import * as Device from 'expo-device';
import * as ExpoLocation from 'expo-location';
import {getAsyncStorage, setAsyncStorage} from './asyncStorage';

import {CURRENT_LOCATION, ENV} from '@constants';
import {Location} from '@types';

const GOOGLE_MAPS_API_KEY = ENV.GOOGLE_MAPS_API_KEY;

const getLocationDetails = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`,
  );

  const data = await res.json();

  const result = data.results.find(
    (item: any) => item.address_components.length === 3,
  );

  if (result) {
    const components = result.address_components;

    const district = components?.at(0).long_name;
    const city = components?.at(1).long_name;
    const nation = components?.at(2).long_name;

    const lo: Location = {
      latitude,
      longitude,
      city,
      district,
      nation,
      description: data.results[0].formatted_address,
    };

    return lo;
  }
};

const requestLocationPermission = async (c: 0 | 1 = 1) => {
  try {
    const {status} = await ExpoLocation.requestForegroundPermissionsAsync();

    if (status !== ExpoLocation.PermissionStatus.GRANTED) {
      throw new Error('Location permission denied');
    }

    const current = await getAsyncStorage<Location>(CURRENT_LOCATION);

    // Emulators have no real GPS fix, so use a fixed location in Da Nang.
    if (!Device.isDevice) {
      await setAsyncStorage(CURRENT_LOCATION, {
        latitude: 16.0743022,
        longitude: 108.1535358,
        city: 'Da Nang',
        description: 'Lien chieu, Da Nang, Vietnam',
      });
      return;
    }

    const position = await ExpoLocation.getCurrentPositionAsync({
      accuracy: ExpoLocation.Accuracy.High,
    });

    const {latitude, longitude} = position.coords;

    if (
      (current &&
        Math.abs(current.latitude - latitude) > 0.001 &&
        Math.abs(current.longitude - longitude) > 0.001 &&
        c === 1) ||
      current === null
    ) {
      const location = await getLocationDetails({latitude, longitude});
      location && (await setAsyncStorage(CURRENT_LOCATION, location));
    }
  } catch (error) {
    await setAsyncStorage(CURRENT_LOCATION, null);
    c === 1 &&
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
};

const fetchDistanceAndTime = async ({
  to,
  from,
}: {
  to: Location;
  from: Location;
}) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${from.latitude},${from.longitude}&destinations=${to.latitude},${to.longitude}&key=${GOOGLE_MAPS_API_KEY}`,
    );

    const data = await response.json();

    const d: number = data.rows[0].elements[0].distance.value / 1000;
    const t: number = data.rows[0].elements[0].duration.value;
    return {to, from, distance: Math.floor(d), timeout: t};
  } catch (error) {
    console.log(error);
  }
};

export {requestLocationPermission, getLocationDetails, fetchDistanceAndTime};
