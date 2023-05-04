import {StyleSheet, View, TextInput} from 'react-native';
import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {useAuth, useDeviceLocation} from '../../hooks';
import {useNavigation} from '@react-navigation/native';

import {RootScreenNavigationProps} from '@navigation';
import {EScreen} from '@enums/EScreen';
import {CustomInput, ScreenBase, CustomButton, DropDown} from '@components';
import {callAPI} from '@services';
import {TUser} from '@types';
import {GRAY_COLOR, TEXT_COLOR} from '@theme';
import {Styles as st, getUserById} from '@utils';
import {EUser} from '@enums';

type TMessage = {
  describe: string;
  type: string;
} & TUser;

const types = ['A', 'B', 'C', 'D', 'E', 'F'];

const SendDistreeSignal = () => {
  const {setOptions, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.MAP>>();

  const {deviceLocation} = useDeviceLocation();

  const [message, setMessage] = useState<TMessage>({
    describe: '',
    type: types[0],
    location: deviceLocation,
  });

  const {currentUser} = useAuth();

  useEffect(() => {
    setOptions({headerShown: false});
    setMessage(prev => ({
      ...prev,
      location: deviceLocation,
    }));
  }, [deviceLocation, setOptions]);

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
  }, []);

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

  console.log(message);

  return (
    <ScreenBase
      onBack={goBack}
      onNext={sendSignal}
      title="You have to connect to the support service">
      {/* <View style={styles.group}>
        <CustomInput
          field={EUser.first}
          nColumn={2}
          value={message.firstName}
          titleStyle={st.text_medium_24}
          valueStyle={st.text_medium_gray_24}
          onChangeText={handleChangeText}
          title="Firt"
          onEndEditing={handleEndEditing}
        />
        <CustomInput
          field={EUser.first}
          nColumn={2}
          value={message.lastName}
          titleStyle={st.text_medium_24}
          valueStyle={st.text_medium_gray_24}
          onChangeText={handleChangeText}
          title="Last"
          onEndEditing={handleEndEditing}
        />
      </View> */}
      <CustomInput
        field={EUser.phoneNumber}
        value={message.phoneNumber}
        titleStyle={st.text_medium_24}
        valueStyle={st.text_medium_gray_24}
        onChangeText={handleChangeText}
        title="Phone"
        onEndEditing={handleEndEditing}
      />
      <CustomInput
        field={EUser.location}
        value={message.location?.description}
        titleStyle={st.text_medium_24}
        valueStyle={st.text_medium_gray_24}
        onChangeText={handleChangeText}
        title="Location"
        onEndEditing={handleEndEditing}
      />
      <CustomInput
        flex="column"
        field="describe"
        value={message.describe}
        titleStyle={st.text_medium_24}
        valueStyle={st.text_medium_gray_24}
        onChangeText={handleChangeText}
        title="Describe"
        onEndEditing={handleEndEditing}
        numberOfLines={2}
        multiline
      />
      <DropDown
        data={types}
        initValue={message.type}
        onSelect={handleChangeText}
        field="type"
      />
    </ScreenBase>
  );
};

export default SendDistreeSignal;

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  container: {
    width: '100%',
    height: 400,
    backgroundColor: '#FFFFFF',
  },
  text_large: {
    fontSize: 64,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: TEXT_COLOR,
  },
  text_medium_30: {
    fontSize: 30,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: TEXT_COLOR,
  },
  text_medium_24: {
    fontSize: 24,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: TEXT_COLOR,
  },
  text_medium_20: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: TEXT_COLOR,
  },
  text_regular_24: {
    fontSize: 24,
    fontWeight: '400',
    fontFamily: 'Roboto',
    color: TEXT_COLOR,
  },
  text_regular_20: {
    fontSize: 20,
    fontWeight: '400',
    fontFamily: 'Roboto',
    color: TEXT_COLOR,
  },
  text_small_16: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: GRAY_COLOR,
  },
  text_small_14: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: GRAY_COLOR,
  },
});
