import {useNavigation} from '@react-navigation/native';
import {StyleSheet, View, TextInput} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {EScreen, EUser} from '@enums';
import {FIRST_INSTALLED} from '@constants';
import {setAsyncStorage, signupInfo} from '@utils';
import {RootScreenNavigationProps} from '@navigation';
import {CustomInput, Loading, ScreenBase} from '@components';
import {useAuth} from '@hooks';

const SetupInfoScreen = () => {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNUP_INFO>>();

  const inputFirstRef = useRef<TextInput>(null);
  const inputLastRef = useRef<TextInput>(null);

  const {currentUser, updateProfile} = useAuth();

  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    setOptions({headerShown: true});

    if (inputFirstRef?.current) {
      inputFirstRef?.current?.focus();
    }
  }, [setOptions, currentUser]);

  const handleNext = useCallback(async () => {
    setLoading(true);
    if (currentUser) {
      try {
        if (firstName !== '' && lastName !== '') {
          await updateProfile(`${firstName} ${lastName}`);

          await signupInfo({
            firstName,
            lastName,
            lastLogin: Date.now(),
            uid: currentUser.uid,
            phoneNumber: currentUser.phoneNumber || '',
          });
          await setAsyncStorage(FIRST_INSTALLED, 1);
          navigate(EScreen.CONFIRM_POLICY);
        }
      } catch (error) {
        console.log('Sign up Info failed: ', error);
      }
    }
    setLoading(false);
  }, [currentUser, firstName, lastName, navigate, updateProfile]);

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
            onChangeText={setFirstName}
            title="First"
            ref={inputFirstRef}
            customStyle={styles.input}
            onEndEditing={handleEndEditing}
          />
          <CustomInput
            field={EUser.last}
            value={lastName}
            onChangeText={setLastName}
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
