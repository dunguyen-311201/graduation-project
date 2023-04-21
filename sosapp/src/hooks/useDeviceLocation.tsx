import {useState, useEffect} from 'react';
import {Location} from '@types';
import Geolocation from '@react-native-community/geolocation';

navigator.geolocation = require('react-native-geolocation-service');

export type useDeviceLocationProps = {
  deviceLocation: Location;
  setLocation: (location: Location) => void;
};

const useDeviceLocation = () => {
  const [deviceLocation, setLocation] = useState<Location>();

  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      const {latitude, longitude} = info.coords;
      setLocation({latitude, longitude});
    });
  }, []);

  return {deviceLocation};
};

export default useDeviceLocation;
