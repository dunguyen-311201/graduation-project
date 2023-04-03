import {StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  RootScreenNavigationProps,
  RootStackParamList,
} from '@navigation/RootNavigation';
import ScreenBase from '@components/ScreenBase';
import ComfirmInput from './components/ComfirmInput';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {setAsyncStorage} from '@utils/asyncStorage';
import {EScreen} from '@enums/EScreen';

type ConfirmRoute = RouteProp<RootStackParamList, EScreen.CONFIRM_PHONE_NUMBER>;

const ConfirmPhoneNumberScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();
  const [code, setCode] = useState('');

  const {confirmation} = useRoute<ConfirmRoute>().params;

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _onChangeText = useCallback((_code: string) => {
    setCode(_code);
  }, []);

  const _navigateNext = useCallback(async () => {
    const user: FirebaseAuthTypes.UserCredential | null =
      await confirmation.confirm(code);
    await setAsyncStorage('user', user);
    navigate(EScreen.HOME);
  }, [code, confirmation, navigate]);

  return (
    <ScreenBase
      desc="Enter the 6-digit code sent to you at"
      onBack={goBack}
      onNext={_navigateNext}>
      <ComfirmInput onChangeText={_onChangeText} />
    </ScreenBase>
  );
};

export default ConfirmPhoneNumberScreen;

const styles = StyleSheet.create({});
