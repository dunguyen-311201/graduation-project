import React, {useCallback, useContext, useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {ScreenBase} from '@components';
import ComfirmInput from './components/ComfirmInput';
import {EScreen} from '@enums';
import {StackParamList} from '@navigation/StackNavigation';
import {StackScreenNavigationProps} from '@navigation';
import {Context} from '@context';

type ConfirmRoute = RouteProp<StackParamList, EScreen.CONFIRM_PHONE_NUMBER>;

const ConfirmPhoneNumberScreen = () => {
  const {userProfile} = useContext(Context);

  const {setOptions, navigate, goBack} =
    useNavigation<StackScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();
  const [code, setCode] = useState('');

  const {confirm} = useRoute<ConfirmRoute>().params;

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _onChangeText = useCallback((_code: string) => {
    setCode(_code);
  }, []);

  const _navigateNext = useCallback(async () => {
    try {
      await confirm(code);

      navigate(EScreen.SIGNUP_NAME);
    } catch (error) {
      console.log(error);
    }
  }, [code, confirm, navigate]);

  return (
    <ScreenBase
      desc={
        'Enter the 6-digit code sent to you at\n' +
        userProfile?.user.phoneNumber
      }
      onBack={goBack}
      onNext={_navigateNext}>
      <ComfirmInput onChangeText={_onChangeText} />
    </ScreenBase>
  );
};

export default ConfirmPhoneNumberScreen;
