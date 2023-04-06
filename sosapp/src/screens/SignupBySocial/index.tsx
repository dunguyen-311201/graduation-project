import {StyleSheet} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RootScreenNavigationProps} from '@navigation/RootNavigation';
import ScreenBase from '@components/ScreenBase';
import {EScreen} from '@enums/EScreen';

const SignupBySocialScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNUP_BY_SOCIAL>>();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _navigateNext = useCallback(() => {
    navigate(EScreen.HOME);
  }, [navigate]);

  return (
    <ScreenBase
      title="Choose an account"
      onBack={goBack}
      onNext={_navigateNext}
    />
  );
};

export default SignupBySocialScreen;

const styles = StyleSheet.create({});
