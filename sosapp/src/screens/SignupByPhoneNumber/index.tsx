import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import {StackScreenNavigationProps} from '@navigation';
import {ScreenBase, CustomText} from '@components';
import {ArrowRightBlueIcon} from '@theme';
import PhoneInput, {INation} from './components/PhoneInput';
import {EScreen} from '@enums';
import {PHONES} from '@constants';

const SignupByPhoneNumberScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<StackScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const [nation, setNation] = useState<INation>({...PHONES[0], phone: ''});

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  // Handle login
  function onAuthStateChanged(user: any) {
    if (user) {
      console.log(30, 'Handle login', user);
    }
  }

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _navigateNext = useCallback(async () => {
    const confirmation = await auth().signInWithPhoneNumber(
      `${nation.code}${nation.phone}`,
    );
    if (confirmation) {
      navigate(EScreen.CONFIRM_PHONE_NUMBER, {confirmation});
    }
  }, [nation.code, nation.phone, navigate]);

  const _navigateSocial = useCallback(() => {
    navigate(EScreen.SIGNUP_BY_SOCIAL);
  }, [navigate]);

  const _onChangePhone = useCallback((_nation: INation) => {
    setNation(_nation);
    console.log(_nation);
  }, []);

  return (
    <ScreenBase
      title="Enter your mobile number"
      onBack={goBack}
      onNext={_navigateNext}>
      <PhoneInput data={nation} onChangePhone={_onChangePhone} />
      <TouchableOpacity style={styles.buttonToSocial} onPress={_navigateSocial}>
        <CustomText
          text="Or connect with social"
          type="text_medium_light_blue_24"
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
    marginTop: 22,
  },
  iconSocial: {
    marginLeft: 10,
  },
});
