import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet} from 'react-native';

import {RootScreenNavigationProps} from '@navigation';
import {useAuth} from '@hooks';
import {EScreen, EUser} from '@enums';
import {
  ScreenBase,
  DropDown,
  Textreae,
  CustomInput,
  Loading,
} from '@components';
import {callAPI} from '@services';
import {getAsyncStorage} from '@utils';
import {Location, TMessage} from '@types';
import {BACKGROUND_COLOR} from '@theme';
import {CURRENT_LOCATION} from '@constants/cache';

const types = ['Traffic accident', 'Vehicle breakdown'];

type MessageType = {phoneNumber: string} & TMessage;

const SendDistreeSignal = () => {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.SEND_DISTRESS_SIGNAL>>();

  const [loading, setLoading] = useState(false);

  const {currentUser} = useAuth();

  const [message, setMessage] = useState<MessageType>({
    description: '',
    type: types[0],
    uid: '',
    phoneNumber: '',
  });

  useEffect(() => {
    setOptions({
      title: 'Send A Distress Signal',
    });

    const setup = async () => {
      if (currentUser) {
        const deviceLocation = await getAsyncStorage<Location>(
          CURRENT_LOCATION,
        );

        const {phoneNumber, uid} = currentUser;

        setMessage(prev => ({
          ...prev,
          location: deviceLocation,
          phoneNumber,
          uid,
        }));
      }
    };

    setup();
  }, [setOptions, currentUser]);

  const sendSignal = useCallback(async () => {
    setLoading(true);

    try {
      const {description, uid, type, location} = message;
      const data = await callAPI({
        route: 'MESSAGE',
        method: 'POST',
        data: {description, uid, type, location},
      });

      console.log(86, data);
    } catch (error) {
      console.log('Send Message Error', error);
    }

    setLoading(false);
    navigate(EScreen.DETAIL_MESSAGE, {uid: ''});
  }, [message, navigate]);

  const handleChangeText = useCallback((value: string, field?: string) => {
    if (field) {
      setMessage(prev => ({...prev, [field]: value}));
    }
  }, []);

  const handleEndEditing = useCallback((field: string) => {
    console.log(field);
  }, []);

  return (
    <ScreenBase
      onNext={sendSignal}
      title="You have to connect to the support service">
      {loading && <Loading />}
      <CustomInput
        field={EUser.phoneNumber}
        value={message.phoneNumber}
        onChangeText={handleChangeText}
        title="Phone"
        onEndEditing={handleEndEditing}
        border
      />
      <CustomInput
        field={EUser.location}
        value={message.location?.description}
        onChangeText={handleChangeText}
        title="Location"
        onEndEditing={handleEndEditing}
        border
      />

      <View style={styles.formMessage}>
        <DropDown
          data={types}
          initValue={message.type}
          onSelect={handleChangeText}
          field="type"
        />
        <Textreae
          value={message.description}
          field="description"
          onChangeText={handleChangeText}
        />
      </View>
    </ScreenBase>
  );
};

export default SendDistreeSignal;

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: BACKGROUND_COLOR,
    height: 100,
  },
  info: {
    justifyContent: 'space-between',
  },
  formMessage: {
    paddingTop: 70,
    position: 'relative',
    zIndex: 1,
  },
});
