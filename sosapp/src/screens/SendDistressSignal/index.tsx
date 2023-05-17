import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Config from 'react-native-config';
import React, {useCallback, useEffect, useState} from 'react';

import {callAPI} from '@services';
import {EScreen} from '@enums';
import {Location, TMessage} from '@types';
import {RootScreenNavigationProps} from '@navigation';
import {getAsyncStorage, requestLocationPermission} from '@utils';
import {
  ScreenBase,
  DropDown,
  Textreae,
  Loading,
  SearchInput,
  CustomText,
} from '@components';
import {CURRENT_LOCATION} from '@constants/cache';
import {ERROR_CODE, Route} from '@constants';
import useAuth from '@hooks/useAuth';

const types = [
  'Rescue request',
  'Traffic incident report',
  'Road issue report',
  'Replacement vehicle request',
  'Emergency support request',
];

const SendDistreeSignal = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.SEND_DISTRESS_SIGNAL>>();

  const {currentUser} = useAuth();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<TMessage>();

  useEffect(() => {
    setOptions({
      title: 'Send A Distress Signal',
    });

    const setup = async () => {
      if (currentUser) {
        setLoading(true);

        const location = await getAsyncStorage<Location>(CURRENT_LOCATION);

        if (Config.ENV === 'dev') {
          if (location) {
            setMessage({
              location,
              userId: currentUser.uid,
              description: '',
              type: types[0],
            });

            setLoading(false);
            return;
          }
        }
        await requestLocationPermission({
          onLocation: async (deviceLocation: Location) => {
            setMessage({
              location: deviceLocation,
              userId: currentUser.uid,
              description: '',
              type: types[0],
            });
            setLoading(false);
          },
          onDenyLocation: () => goBack(),
        });
      }
    };

    setup();
  }, [currentUser]);

  const sendSignal = useCallback(async () => {
    setLoading(true);

    const {data, status} = await callAPI({
      route: Route.MESSAGE,
      method: 'POST',
      data: message,
    });

    if (status !== ERROR_CODE && data) {
      navigate(EScreen.DETAIL_MESSAGE, {uid: data.uid});
    }

    setLoading(false);
  }, [message, navigate]);

  const handleChangeText = useCallback((value: string, field?: string) => {
    if (field) {
      setMessage(prev => ({...prev, [field]: value}));
    }
  }, []);

  const handleEndEditing = useCallback((field: string) => {
    field;
  }, []);

  const handleSearch = useCallback(async (_location: Location) => {
    setMessage(prev => ({...prev, location: _location}));
  }, []);

  return (
    <>
      {loading && <Loading />}
      <ScreenBase
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
          title="Description"
          value={message?.description}
          field="description"
          onChangeText={handleChangeText}
        />
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
