import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RootScreenNavigationProps} from '@navigation/RootNavigation';
import {CustomButton, CustomInput, CustomText} from '@components/common';
import ScreenBase from '@components/ScreenBase';
import {ArrowRightBlueIcon} from '@theme/icon';
import PhoneInput from './components/PhoneInput';

const SignupByPhoneNumberScreen = () => {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<'SignupByPhoneNumber'>>();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _navigateNext = useCallback(() => {
    navigate('ConfirmPhoneNumber');
  }, [navigate]);

  const _navigateBack = useCallback(() => {
    navigate('Splash');
  }, [navigate]);

  return (
    <ScreenBase
      title="Enter your mobile number"
      onBack={_navigateBack}
      onNext={_navigateNext}>
      <PhoneInput />
      <TouchableOpacity style={styles.buttonToSocial}>
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
