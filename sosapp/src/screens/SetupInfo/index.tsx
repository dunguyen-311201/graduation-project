import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {EScreen} from '@enums';
import {RootScreenNavigationProps} from '@navigation';
import {CustomInput, ScreenBase} from '@components';
import {getAsyncStorage, setAsyncStorage} from '@utils';
import {EUser} from '@enums';
import {USER_CACHE} from '@constants';
import {TextInput} from 'react-native-gesture-handler';
import {TUser} from '@types';

const SetupInfoScreen = () => {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNUP_INFO>>();

  const inputFirstRef = useRef<TextInput>(null);
  const inputLastRef = useRef<TextInput>(null);

  const [data, setData] = useState<TUser>();

  const {firstName, lastName} = data || {};

  useEffect(() => {
    setOptions({headerShown: true});

    if (inputFirstRef?.current) {
      inputFirstRef?.current?.focus();
    }
  }, [setOptions]);

  const handleNext = useCallback(async () => {
    if (firstName && lastName) {
      const caseUser = await getAsyncStorage<TUser>(USER_CACHE);

      await setAsyncStorage<TUser>(USER_CACHE, {
        firstName,
        lastName,
        ...caseUser,
      });
      navigate(EScreen.CONFIRM_POLICY);
    }
  }, [firstName, lastName, navigate]);

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
    <ScreenBase desc="What's your name?" onNext={handleNext}>
      <View style={styles.group}>
        <CustomInput
          field={EUser.first}
          value={firstName}
          onChangeText={handleChangeText}
          placeholder="First"
          ref={inputFirstRef}
          customStyle={styles.input}
          onEndEditing={handleEndEditing}
        />
        <CustomInput
          field={EUser.last}
          value={lastName}
          onChangeText={handleChangeText}
          ref={inputLastRef}
          placeholder="Last"
          onEndEditing={handleEndEditing}
          customStyle={styles.input}
        />
      </View>
    </ScreenBase>
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
