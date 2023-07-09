import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {BackHandler, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';

import {EScreen} from '@enums';
import {ArrowRightBlueIcon} from '@theme';
import PhoneInput from './components/PhoneInput';
import {CustomButton, ScreenBase} from '@components';
import {RootScreenNavigationProps} from '@navigation';

const SignupByPhoneNumberScreen = () => {
  const {navigate, setOptions} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const [phone, setPhone] = useState<string>('');

  useEffect(() => {
    setOptions({headerShown: false});
  }, []);

  const handleNext = useCallback(async () => {
    if (!phone) {
      setError('Please enter a phone number');
      return;
    }
    try {
      setLoading(true);

      const result = await auth().signInWithPhoneNumber(phone);

      if (result.verificationId) {
        navigate(EScreen.CONFIRM_PHONE_NUMBER, {
          phone,
          verificationId: result.verificationId,
        });
      }
    } catch (err) {
      setError('Please verify your phone number!');
    }
    setLoading(false);
  }, [phone]);

  const handleNavigateSocial = useCallback(() => {
    navigate(EScreen.SIGNUP_BY_SOCIAL);
  }, [navigate]);

  const handleChangePhone = useCallback((value: string) => {
    setPhone(value);
  }, []);

  return (
    <ScreenBase
      title="Enter your phone number"
      onNext={handleNext}
      loading={loading}
      disableNext={phone.length !== 12}
      onBack={() => BackHandler.exitApp()}>
      <PhoneInput
        field="phone"
        onEndEditing={handleChangePhone}
        errorMessage={error}
      />
      <CustomButton
        label="Or connect with social"
        type="secondary"
        icon={ArrowRightBlueIcon}
        onPress={handleNavigateSocial}
        customStyle={styles.button}
      />
    </ScreenBase>
  );
};

export default SignupByPhoneNumberScreen;

const styles = StyleSheet.create({
  button: {
    marginTop: 22,
  },
});
