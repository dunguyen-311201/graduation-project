import React, {useCallback, useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import {ScreenBase, CustomInput} from '@components';
import {EScreen} from '@enums';
import {RootScreenNavigationProps} from '@navigation';

import {getAsyncStorage, setAsyncStorage, Styles as st} from '@utils';
import {RootParamList} from '@navigation/RootNavigation';

type ConfirmRoute = RouteProp<RootParamList, EScreen.CONFIRM_PHONE_NUMBER>;

const ConfirmPhoneNumberScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const [code, setCode] = useState('');

  const {phone, comfirmation} = useRoute<ConfirmRoute>().params;

  useEffect(() => {
    const setup = async () => {
      setOptions({headerShown: false});
      const isNew = await getAsyncStorage('isNew');
      if (isNew === null) {
        await setAsyncStorage('isNew', 1);
      }
    };

    setup();
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

      const {additionalUserInfo} = await auth().signInWithCredential(
        credential,
      );
      if (!additionalUserInfo?.isNewUser) {
        navigate(EScreen.DRAWER);
        return;
      }
      navigate(EScreen.SIGNUP_INFO);
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
        onEndEditing={_navigateNext}
        valueStyle={st.text_medium_24}
        maxLength={6}
      />
    </ScreenBase>
  );
};

export default ConfirmPhoneNumberScreen;
