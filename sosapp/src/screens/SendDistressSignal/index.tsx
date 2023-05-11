import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';

import {useAuth} from '@hooks';
import {callAPI} from '@services';
import {EScreen, EUser} from '@enums';
import {getAsyncStorage} from '@utils';
import {Location, TMessage} from '@types';
import {CURRENT_LOCATION} from '@constants';
import {RootScreenNavigationProps} from '@navigation';
import {ScreenBase, DropDown, Textreae, CustomInput} from '@components';

const types = [
  'Rescue request',
  'Traffic incident report',
  'Road issue report',
  'Replacement vehicle request',
  'Emergency support request',
];

type MessageType = {phoneNumber: string} & TMessage;

const SendDistreeSignal = () => {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.SEND_DISTRESS_SIGNAL>>();

  const {currentUser} = useAuth();

  const [message, setMessage] = useState<MessageType>({
    description: '',
    type: types[0],
    userId: '',
    phoneNumber: '',
  });

  useEffect(() => {
    setOptions({
      title: 'Send A Distress Signal',
    });

    const setup = async () => {
      if (currentUser === null) {
        return;
      }
      const {phoneNumber, uid} = currentUser;

      const deviceLocation = await getAsyncStorage<Location>(CURRENT_LOCATION);

      if (phoneNumber === null || deviceLocation === null) {
        return;
      }
      setMessage(prev => ({
        ...prev,
        location: deviceLocation,
        userId: uid,
        phoneNumber,
      }));
    };

    setup();
  }, [setOptions, currentUser]);

  const sendSignal = useCallback(async () => {
    try {
      const {data, status} = await callAPI({
        route: 'MESSAGE',
        method: 'POST',
        data: message,
      });
      console.log('Send Message status code: ', status);
      // navigate(EScreen.DETAIL_MESSAGE, {uid: data.uid});
      navigate(EScreen.MAP, {});
    } catch (error) {
      console.log('Send Message Error', error);
    }
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
        value={
          message.location?.description?.more ||
          message.location?.description?.district ||
          ''
        }
        onChangeText={handleChangeText}
        title="Location"
        onEndEditing={handleEndEditing}
        border
      />

      <DropDown
        data={types}
        initValue={message.type}
        onSelect={handleChangeText}
        field="type"
        title="Type"
      />
      <Textreae
        title="Description"
        value={message.description}
        field="description"
        onChangeText={handleChangeText}
      />
    </ScreenBase>
  );
};

export default SendDistreeSignal;

const styles = StyleSheet.create({});
