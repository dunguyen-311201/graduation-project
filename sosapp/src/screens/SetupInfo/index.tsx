import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {EScreen} from '@enums';
import {RootScreenNavigationProps} from '@navigation';
import {CustomInput, Loading, ScreenBase} from '@components';
import {
  getDeviceToken,
  handleUpdateProfile,
  setAsyncStorage,
  signupInfo,
} from '@utils';
import {EUser} from '@enums';
import {FIRST_INSTALLED} from '@constants';
import {TextInput} from 'react-native-gesture-handler';
import {TUser} from '@types';
import useAuth from '@hooks/useAuth';

const SetupInfoScreen = () => {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNUP_INFO>>();

  const inputFirstRef = useRef<TextInput>(null);
  const inputLastRef = useRef<TextInput>(null);

  const {currentUser} = useAuth();

  const [data, setData] = useState<TUser>();
  const [loading, setLoading] = useState(false);

  const {firstName, lastName} = data || {};

  useEffect(() => {
    setOptions({headerShown: true});

    if (currentUser) {
      const {uid, phoneNumber} = currentUser;
      setData({uid, phoneNumber});
    }

    if (inputFirstRef?.current) {
      inputFirstRef?.current?.focus();
    }
  }, [setOptions, currentUser]);

  const handleNext = useCallback(async () => {
    setLoading(true);
    try {
      if (firstName && lastName) {
        const token = await getDeviceToken();
        await signupInfo({
          ...data,
          token,
          lastLogin: Date.now(),
        });
        await handleUpdateProfile(`${firstName} ${lastName}`);
        await setAsyncStorage(FIRST_INSTALLED, 1);
      }
    } catch (error) {
      console.log('Sign up Info failed: ', error);
    }
    setLoading(false);
    navigate(EScreen.CONFIRM_POLICY);
  }, [data, firstName, lastName, navigate]);

  const handleChangeText = useCallback((value: string, field?: string) => {
    if (field) {
      setData(prev => ({...prev, [field]: value}));
    }
  }, []);

  const handleEndEditing = useCallback(
    (field: string) => {
      if (field === EUser.first) {
        inputLastRef?.current?.focus();
        return;
      }
      handleNext();
    },
    [handleNext],
  );

  return (
    <>
      {loading && <Loading />}
      <ScreenBase desc="What's your name?" onNext={handleNext}>
        <View style={styles.group}>
          <CustomInput
            field={EUser.first}
            value={firstName}
            onChangeText={handleChangeText}
            title="First"
            ref={inputFirstRef}
            customStyle={styles.input}
            onEndEditing={handleEndEditing}
          />
          <CustomInput
            field={EUser.last}
            value={lastName}
            onChangeText={handleChangeText}
            ref={inputLastRef}
            title="Last"
            onEndEditing={handleEndEditing}
            customStyle={styles.input}
          />
        </View>
      </ScreenBase>
    </>
  );
};

export default SetupInfoScreen;

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  input: {
    width: '45%',
  },
});
