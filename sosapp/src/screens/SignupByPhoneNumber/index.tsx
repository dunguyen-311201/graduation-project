import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import {RootScreenNavigationProps} from '@navigation/RootNavigation';
import {CustomText} from '@components/common';
import ScreenBase from '@components/ScreenBase';
import {ArrowRightBlueIcon} from '@theme/icon';
import PhoneInput from './components/PhoneInput';
import {EScreen} from '@enums/EScreen';

const SignupByPhoneNumberScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult>();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle login
  function onAuthStateChanged(user) {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
    }
  }

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _navigateNext = useCallback(async () => {
    const confirmation = await auth().signInWithPhoneNumber('+84917874915');
    setConfirm(confirmation);
    navigate(EScreen.CONFIRM_PHONE_NUMBER, {confirmation});
  }, [navigate]);

  const _navigateSocial = useCallback(() => {
    navigate(EScreen.SIGNUP_BY_SOCIAL);
  }, [navigate]);

  return (
    <ScreenBase
      title="Enter your mobile number"
      onBack={goBack}
      onNext={_navigateNext}>
      <PhoneInput />
      <TouchableOpacity style={styles.buttonToSocial} onPress={_navigateSocial}>
        <CustomText
          text="Or connect with social"
          style={['fs6', 'fw5', 'cbl']}
        />
        <Image source={ArrowRightBlueIcon} style={styles.iconSocial} />
      </TouchableOpacity>
    </ScreenBase>
  );
};

export default SignupByPhoneNumberScreen;

const styles = StyleSheet.create({
  buttonToSocial: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSocial: {
    marginLeft: 10,
  },
});
