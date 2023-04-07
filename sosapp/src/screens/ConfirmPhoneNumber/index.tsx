import React, {useCallback, useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {ScreenBase} from '@components';
import ComfirmInput from './components/ComfirmInput';
import {EScreen} from '@enums';
import {StackParamList} from '@navigation/StackNavigation';
import {StackScreenNavigationProps} from '@navigation';

type ConfirmRoute = RouteProp<StackParamList, EScreen.CONFIRM_PHONE_NUMBER>;

const ConfirmPhoneNumberScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<StackScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();
  const [code, setCode] = useState('');

  const {confirmation} = useRoute<ConfirmRoute>().params;

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _onChangeText = useCallback((_code: string) => {
    setCode(_code);
  }, []);

  const _navigateNext = useCallback(async () => {
    const user = await confirmation.confirm(code);
    if (user) {
      const {additionalUserInfo} = user;
      if (additionalUserInfo?.isNewUser) {
        navigate(EScreen.SIGNUP_NAME);
        return;
      }
      navigate(EScreen.HOME);
    }

    /***
     * validate
     * */
  }, [confirmation, code, navigate]);

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
