import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RootScreenNavigationProps} from '@navigation/RootNavigation';
import {CustomButton} from '@components/common';
import ScreenBase from '@components/ScreenBase';

const ConfirmPhoneNumberScreen = () => {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<'ConfirmPhoneNumber'>>();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _navigateNext = useCallback(() => {
    navigate('Home');
  }, [navigate]);

  const _navigateBack = useCallback(() => {
    navigate('SignupByPhoneNumber');
  }, [navigate]);

  return (
    <ScreenBase
      desc="Enter the 4-digit code sent to you at"
      onBack={_navigateBack}
      onNext={_navigateNext}
    />
  );
};

export default ConfirmPhoneNumberScreen;

const styles = StyleSheet.create({});
