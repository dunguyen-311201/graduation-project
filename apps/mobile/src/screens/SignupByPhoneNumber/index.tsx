import {StyleSheet, View} from 'react-native';
import {CustomButton, ScreenBase} from '@components';
import React, {useCallback, useEffect, useState} from 'react';

import {ArrowRightBlueIcon} from '@theme';
import {EScreen} from '@enums';
import PhoneInput from './components/PhoneInput';
import {RootScreenNavigationProps} from '@navigation';
import {signInWithPhoneNumber} from '@react-native-firebase/auth';
import {auth} from '@services';
import {useNavigation} from '@react-navigation/native';

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

      const result = await signInWithPhoneNumber(auth, phone);

      if (result.verificationId) {
        navigate(EScreen.CONFIRM_PHONE_NUMBER, {
          phone,
          verificationId: result.verificationId,
        });
      }
    } catch (err: any) {
      if (err?.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else if (err?.code === 'auth/network-request-failed') {
        setError('No connection. Check your network and try again.');
      } else {
        setError('This phone number could not be verified. Please check it.');
      }
    }
    setLoading(false);
  }, [phone]);

  const handleNavigateSocial = useCallback(() => {
    navigate(EScreen.SIGNUP_BY_SOCIAL);
  }, [navigate]);

  const handleChangePhone = useCallback((value: string) => {
    setPhone(value);
    setError(undefined);
  }, []);

  return (
    <ScreenBase
      title="Enter your phone number"
      onNext={handleNext}
      loading={loading}
      disableNext={!phone}>
      <View style={styles.container}>
        <PhoneInput onEndEditing={handleChangePhone} errorMessage={error} />

        <CustomButton
          label="Other sign-in options"
          type="secondary"
          icon={ArrowRightBlueIcon}
          onPress={handleNavigateSocial}
        />
      </View>
    </ScreenBase>
  );
};

export default SignupByPhoneNumberScreen;

const styles = StyleSheet.create({
  container: {
    rowGap: 22,
  },
});
