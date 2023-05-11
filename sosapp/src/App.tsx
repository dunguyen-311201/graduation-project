// import StorybookUIRoot from './.ondevice/Storybook';
import React, {useEffect, useState} from 'react';
import {StyleSheet, PermissionsAndroid, Platform} from 'react-native';
import 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

import {RootNavigation} from './navigation';
import {Context, ContextProps} from './context';
import {WHITE_COLOR} from './theme';
import {getAsyncStorage, getLocationDetails, setAsyncStorage} from './utils';
import {CURRENT_LOCATION, FIRST_INSTALLED} from './constants';
import {useAuth} from './hooks';
import Geolocation from '@react-native-community/geolocation';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const {currentUser} = useAuth();

  const store: ContextProps = {
    isAuthenticated,
    onAuthenticated: setIsAuthenticated,
    isCompleted,
    onCompleted: setIsCompleted,
  };

  useEffect(() => {
    const setup = async () => {
      const location = await getAsyncStorage(CURRENT_LOCATION);
      const isFirst = await getAsyncStorage(FIRST_INSTALLED);

      if (isFirst === null) {
        setIsCompleted(true);
        return;
      }

      if (currentUser && currentUser.displayName) {
        setIsAuthenticated(true);
      } else if (isFirst !== null && location) {
        setIsCompleted(true);
        await setAsyncStorage(CURRENT_LOCATION, null);
      }
    };

    setup();
  }, [currentUser]);

  useEffect(() => {
    const getLocation = () => {
      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;

          const data = await getLocationDetails({latitude, longitude});
          if (data) {
            await setAsyncStorage(CURRENT_LOCATION, {
              latitude,
              longitude,
              description: data,
            });

            setIsCompleted(true);
          }
        },
        error => {
          console.log(error);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    };

    const requestLocationPermission = async () => {
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
          getLocation();
        } else {
          console.log('Location permission denied');
        }
      } else {
        getLocation;
      }
    };

    if (isAuthenticated) {
      requestLocationPermission();
    }
  }, [isAuthenticated]);

  return (
    <Context.Provider value={store}>
      <SafeAreaView style={styles.container}>
        <RootNavigation />
      </SafeAreaView>
    </Context.Provider>
  );
}

export default App;

// export {StorybookUIRoot as default};

const styles = StyleSheet.create({
  container: {flex: 1},
  message: {
    backgroundColor: WHITE_COLOR,
    width: '80%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: 'center',
    marginTop: 5,
    borderRadius: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
