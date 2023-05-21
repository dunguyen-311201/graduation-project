import DeviceInfo from 'react-native-device-info';
import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid, Platform, Alert, Linking} from 'react-native';

import Config from 'react-native-config';
import {Location} from '@types';
import {CURRENT_LOCATION} from '@constants';
import {getAsyncStorage, setAsyncStorage} from './asyncStorage';

const GOOGLE_MAPS_API_KEY = Config.GOOGLE_MAPS_API_KEY;

const getLocationByEmulator = async () => {
  if (await DeviceInfo.isEmulator()) {
    const location: Location = {
      latitude: 16.0544563,
      longitude: 108.0717219,
      city: 'Da Nang',
      description: 'Da Nang, Vietnam',
    };
    await setAsyncStorage(CURRENT_LOCATION, location);
    return location;
  }
};

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

    // const district = components[0].long_name;
    const city = components?.at(-2).long_name;
    // const nation = components[2].long_name;

    const des: Location = {
      latitude,
      longitude,
      city,
      description: result.formatted_address,
    };

    await setAsyncStorage(CURRENT_LOCATION, des);
    return des;
  }
};

const getLocation = async (onDenyLocation?: () => void) => {
  if (await DeviceInfo.isEmulator()) {
    const location: Location = {
      latitude: 16.0544563,
      longitude: 108.0717219,
      city: 'Da Nang',
      description: 'Da Nang, Vietnam',
    };
    await setAsyncStorage(CURRENT_LOCATION, location);
    return;
  }
  Geolocation.getCurrentPosition(
    async position => {
      const {latitude, longitude} = position.coords;

      let current = await getAsyncStorage<Location>(CURRENT_LOCATION);
      if (
        !current ||
        (Math.round(current?.latitude) !== Math.round(latitude) &&
          Math.round(current?.longitude) !== Math.round(longitude))
      ) {
        await requestLocationPermission(onDenyLocation);

        const data = await getLocationDetails({latitude, longitude});
        current = {
          latitude,
          longitude,
          ...data,
        };
        await setAsyncStorage(CURRENT_LOCATION, current);
      }
    },
    () => {},
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
  );
};

const requestLocationPermission = async (onDenyLocation?: () => void) => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      if (await DeviceInfo.isEmulator()) {
        const location: Location = {
          latitude: 16.0544563,
          longitude: 108.0717219,
          city: 'Da Nang',
          description: 'Da Nang, Vietnam',
        };
        await setAsyncStorage(CURRENT_LOCATION, location);
        onDenyLocation && onDenyLocation();
        return;
      }

      onDenyLocation && onDenyLocation();
      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;

          let current = await getAsyncStorage<Location>(CURRENT_LOCATION);
          if (
            !current ||
            (Math.round(current?.latitude) !== Math.round(latitude) &&
              Math.round(current?.longitude) !== Math.round(longitude))
          ) {
            await requestLocationPermission(onDenyLocation);

            const data = await getLocationDetails({latitude, longitude});
            current = {
              latitude,
              longitude,
              ...data,
            };
            await setAsyncStorage(CURRENT_LOCATION, current);
          }
        },
        () => {},
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
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

export {
  getLocation,
  requestLocationPermission,
  getLocationDetails,
  fetchDistanceAndTime,
  getLocationByEmulator,
};
