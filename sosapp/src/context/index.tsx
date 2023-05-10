import {CURRENT_LOCATION} from '@constants/cache';
import Geolocation from '@react-native-community/geolocation';
import {Location} from '@types';
import {getAsyncStorage, setAsyncStorage} from '@utils/asyncStorage';
import {getLocationDetails} from '@utils/location';
import React, {createContext, useState, useEffect} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';

export type ContextProps = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  resetLocation: () => void;
  isReload: boolean;
};

export const Context = createContext<ContextProps>({
  loading: false,
  setLoading: () => {},
  resetLocation: () => {},
  isReload: false,
});

export const ContextProvider = ({children}: {children: React.ReactNode}) => {
  const [loading, setLoading] = useState(false);
  const [isReload, setReload] = useState(false);

  const [deviceLocation, setLocation] = useState<Location>();

  const store: ContextProps = {
    loading,
    setLoading,
    isReload,
    resetLocation: () => {
      setReload(true);
    },
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      const location = await getAsyncStorage(CURRENT_LOCATION);
      if (location === null || isReload) {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message:
                'This app needs access to your location to show your current position on the map',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Geolocation.getCurrentPosition(
              position => {
                const {latitude, longitude} = position.coords;

                setLocation({
                  latitude,
                  longitude,
                });
              },
              error => {
                console.log(error);
              },
              {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
            );
          } else {
            console.log('Location permission denied');
          }
        } else {
          Geolocation.getCurrentPosition(
            position => {
              const {latitude, longitude} = position.coords;

              setLocation({
                latitude,
                longitude,
              });
            },
            error => {
              console.log(error);
            },
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
          );
        }
        setReload(false);
      }
    };

    requestLocationPermission();
  }, [isReload]);

  useEffect(() => {
    const getDetail = async () => {
      if (deviceLocation) {
        const data = await getLocationDetails(deviceLocation);
        console.log(99, data);
        if (data && deviceLocation.description?.city !== data.city) {
          setLocation({...deviceLocation, description: data});
          await setAsyncStorage(CURRENT_LOCATION, {
            ...deviceLocation,
            description: data,
          });
        }
      }
    };

    getDetail();
  }, [deviceLocation]);

  return <Context.Provider value={store}>{children}</Context.Provider>;
};
