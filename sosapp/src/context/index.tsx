import {EScreen} from '@enums';
import {RootParamList} from '@navigation/RootNavigation';
import Geolocation from '@react-native-community/geolocation';
import {Location} from '@types';
import React, {createContext, useEffect, useState} from 'react';

export type ContextProps = {
  isVisibleNotification: boolean;
  setIsVisibleNotification: (state: boolean) => void;
  initRoute?: keyof RootParamList;
  setInitRoute: (route: keyof RootParamList) => void;
  deviceLocation?: Location;
};

export const Context = createContext<ContextProps>({
  isVisibleNotification: false,
  setIsVisibleNotification: (state: boolean) => state,
  initRoute: EScreen.SPLASH,
  setInitRoute: (route: keyof RootParamList) => {
    route;
  },
});

export const ContextProvider = ({children}: {children: React.ReactNode}) => {
  const [isVisibleNotification, setIsVisibleNotification] = useState(false);
  const [initRoute, setInitRoute] = useState<keyof RootParamList>(
    EScreen.SPLASH,
  );

  const [deviceLocation, setDeviceLocation] = useState<Location>();

  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      const {latitude, longitude} = info.coords;
      setDeviceLocation({latitude, longitude, description: 'Current location'});
    });
  }, []);

  const store: ContextProps = {
    isVisibleNotification,
    setIsVisibleNotification,
    initRoute,
    setInitRoute,
    deviceLocation,
  };

  return <Context.Provider value={store}>{children}</Context.Provider>;
};
