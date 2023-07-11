import {BackHandler, StyleSheet, View} from 'react-native';
import {CustomButton, ScreenBase} from '@components';
import React, {useCallback, useEffect, useState} from 'react';

import {ArrowRightBlueIcon} from '@theme';
import {EScreen} from '@enums';
import PhoneInput from './components/PhoneInput';
import {RootScreenNavigationProps} from '@navigation';
import auth from '@react-native-firebase/auth';
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

      const result = await auth().signInWithPhoneNumber(
        phone.split(' ').join(''),
      );

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
      <View style={styles.container}>
        <PhoneInput onEndEditing={handleChangePhone} errorMessage={error} />

        <CustomButton
          label="Or connect with social"
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
