import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet} from 'react-native';

import {RootScreenNavigationProps} from '@navigation';
import {useAuth} from '@hooks';
import {EScreen, EUser} from '@enums';
import {ScreenBase, DropDown, Textreae, CustomInput} from '@components';
import {callAPI} from '@services';
import {getUserById} from '@utils';
import {TMessage} from '@types';
import {Context} from '@context';
import {BACKGROUND_COLOR} from '@theme';

const types = ['Traffic accident', 'Vehicle breakdown'];

type MessageType = {phoneNumber: string} & TMessage;

const SendDistreeSignal = () => {
  const {setOptions} =
    useNavigation<RootScreenNavigationProps<EScreen.SEND_DISTRESS_SIGNAL>>();

  const {deviceLocation} = useContext(Context);

  const {currentUser} = useAuth();

  const [message, setMessage] = useState<MessageType>({
    description: '',
    type: types[0],
    location: deviceLocation,
    uid: '',
    phoneNumber: '',
  });

  useEffect(() => {
    setOptions({
      title: 'Send a distress signal',
    });

    if (currentUser !== null) {
      const {uid, phoneNumber} = currentUser;

      if (uid && phoneNumber !== null) {
        setMessage(prev => ({
          ...prev,
          location: deviceLocation,
          phoneNumber,
          uid,
        }));
      }
    }
  }, [currentUser, deviceLocation, setOptions]);

  useEffect(() => {
    const setFormData = async () => {
      if (currentUser) {
        const user = await getUserById(currentUser.uid);
        if (user) {
          setMessage(prev => ({
            ...user,
            ...prev,
          }));
        }
      }
    };

    setFormData();
  }, [currentUser]);

  const sendSignal = useCallback(async () => {
    await callAPI({
      route: 'MESSAGE',
      method: 'POST',
      data: message,
    });
  }, [message]);

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
        <Textreae />
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
