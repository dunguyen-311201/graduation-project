import {StyleSheet, View, Keyboard} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {callAPI} from '@services';
import {EScreen} from '@enums';
import {Location, TMessage} from '@types';
import {RootScreenNavigationProps} from '@navigation';
import {
  getAsyncStorage,
  getLocationByEmulator,
  getLocationDetails,
  setAsyncStorage,
} from '@utils';
import {
  ScreenBase,
  DropDown,
  Textreae,
  Loading,
  SearchInput,
  CustomText,
  Error,
} from '@components';
import {CURRENT_LOCATION} from '@constants/cache';
import {ERROR_CODE, Route} from '@constants';
import useAuth from '@hooks/useAuth';
import {TextInput} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const types = [
  'Rescue request',
  'Traffic incident report',
  'Road issue report',
  'Replacement vehicle request',
  'Emergency support request',
];

const SendDistreeSignal = () => {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.SEND_DISTRESS_SIGNAL>>();

  const {currentUser} = useAuth();
  const [error, setError] = useState(null);
  const [location, setLocation] = useState<Location>();

  const textreaeRef = useRef<TextInput>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<TMessage>({
    description: '',
    type: types[0],
    userId: currentUser?.uid,
  });

  useEffect(() => {
    setOptions({
      title: 'Send A Distress Signal',
    });

    Geolocation.getCurrentPosition(position => {
      const {latitude, longitude} = position.coords;

      setLocation({latitude, longitude});
    });
  }, []);

  useEffect(() => {
    const setup = async () => {
      if (currentUser) {
        setLoading(true);

        if (location?.city) {
          return;
        }

        const testLocation = await getLocationByEmulator();
        let current = await getAsyncStorage<Location>(CURRENT_LOCATION);

        if (current === null && testLocation) {
          current = testLocation;
        }

        if (testLocation) {
          setMessage(prev => ({...prev, location: testLocation}));
          await setAsyncStorage(CURRENT_LOCATION, testLocation);
        } else if (
          location &&
          current?.city === null &&
          location.city === null
        ) {
          const details = await getLocationDetails(location);
          setMessage(prev => ({...prev, location: details}));
        } else {
          setMessage(prev => ({...prev, location: current}));
        }

        setLoading(false);
      }
    };

    setup();
  }, [currentUser, location]);

  const sendSignal = useCallback(async () => {
    setLoading(true);

    console.log(message);

    const {data, status} = await callAPI({
      route: Route.MESSAGE,
      method: 'POST',
      data: message,
    });

    if (status !== ERROR_CODE && data?.uid) {
      navigate(EScreen.DETAIL_MESSAGE, {uid: data.uid});
    } else {
      setError(data);
    }

    setLoading(false);
  }, [message, navigate]);

  const handleChangeText = useCallback((value: string, field?: string) => {
    if (field) {
      setMessage(prev => ({...prev, [field]: value}));
    }
  }, []);

  const handleSearch = useCallback(async (_location: Location) => {
    setMessage(prev => ({...prev, location: _location}));
  }, []);

  const handleTouchOutside = useCallback(() => {
    if (textreaeRef?.current) {
      Keyboard.dismiss();
    }
  }, []);

  return (
    <>
      {loading && <Loading />}
      <ScreenBase
        onTouchOutside={handleTouchOutside}
        onNext={sendSignal}
        title="You have to connect to the support service">
        <View style={styles.mapField}>
          <CustomText text="Location" type="text_medium_16" />
          <SearchInput
            origin={message?.location}
            onSearch={handleSearch}
            placeholder="Location"
            field="location"
            isDirection={true}
            zIndex={4}
            customStyle={styles.search}
          />
        </View>
        <DropDown
          data={types}
          initValue={message?.type}
          onSelect={handleChangeText}
          field="type"
          title="Type"
        />
        <Textreae
          ref={textreaeRef}
          title="Description"
          value={message?.description}
          field="description"
          onChangeText={handleChangeText}
        />
        {error && <Error message="Please check request!" />}
      </ScreenBase>
    </>
  );
};

export default SendDistreeSignal;

const styles = StyleSheet.create({
  mapField: {
    position: 'relative',
    width: '100%',
    height: 80,
    marginTop: 20,
    zIndex: 3,
  },
  search: {
    top: 20,
    right: -10,
  },
});
