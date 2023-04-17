import React, {useCallback, useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import {ScreenBase, CustomInput} from '@components';
import {EScreen} from '@enums';
import {RootScreenNavigationProps} from '@navigation';

import {Styles as st} from '@utils';
import {RootParamList} from '@navigation/RootNavigation';

type ConfirmRoute = RouteProp<RootParamList, EScreen.CONFIRM_PHONE_NUMBER>;

const ConfirmPhoneNumberScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const [code, setCode] = useState('');

  const {phone, comfirmation} = useRoute<ConfirmRoute>().params;

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _onChangeText = useCallback((_code: string) => {
    setCode(_code);
  }, []);

  const _navigateNext = useCallback(async () => {
    try {
      const credential = auth.PhoneAuthProvider.credential(
        comfirmation.verificationId,
        code,
      );

      await auth().signInWithCredential(credential);

      navigate(EScreen.SIGNUP_NAME);
    } catch (error) {
      console.log(error);
    }
  }, [code, comfirmation, navigate]);

  return (
    <ScreenBase
      desc={'Enter the 6-digit code sent to you at\n' + phone}
      onBack={goBack}
      onNext={_navigateNext}>
      <CustomInput
        value={code}
        onChangeText={_onChangeText}
        field="phone"
        inputMode="numeric"
        valueStyle={st.text_medium_24}
        maxLength={6}
      />
    </ScreenBase>
  );
};

export default ConfirmPhoneNumberScreen;
