import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {CustomButton} from '@components/common';
import {useNavigation} from '@react-navigation/native';
import {RootScreenNavigationProps} from '@navigation/RootNavigation';
import ScreenBase from '@components/ScreenBase';

const SignupByGoogleOrFacebookScreen = () => {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<'SignupByGoogleOrFacebook'>>();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _navigateNext = useCallback(() => {
    navigate('Home');
  }, [navigate]);

  const _navigateBack = useCallback(() => {
    navigate('Splash');
  }, [navigate]);

  return (
    <ScreenBase
      title="Choose an account"
      onBack={_navigateBack}
      onNext={_navigateNext}
    />
  );
};

export default SignupByGoogleOrFacebookScreen;

const styles = StyleSheet.create({});
