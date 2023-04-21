import React, {useCallback, useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {ScreenBase, CustomInput} from '@components';
import {EScreen, EUser} from '@enums';
import {RootScreenNavigationProps} from '@navigation';
import {setAsyncStorage, Styles as st} from '@utils';
import {RootParamList} from '@navigation/RootNavigation';
import useAuth from '@hooks/useAuth';
import {TUser} from '@types';
import {USER_CACHE} from '@constants';

type ConfirmRoute = RouteProp<RootParamList, EScreen.CONFIRM_PHONE_NUMBER>;

const ConfirmPhoneNumberScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const {phone, verificationId} = useRoute<ConfirmRoute>().params;

  const [code, setCode] = useState('');

  const {handleVerification, currentUser} = useAuth();

  useEffect(() => {
    setOptions({headerShown: false});
    if (currentUser) {
      navigate(EScreen.SIGNUP_INFO);
    }
  }, [currentUser, navigate, setOptions]);

  const handleNext = useCallback(async () => {
    const {user, additionalUserInfo} = await handleVerification(
      verificationId,
      code,
    );

    const {uid, phoneNumber, displayName} = user;

    if (uid && phoneNumber !== null) {
      await setAsyncStorage<TUser>(USER_CACHE, {
        [EUser.uid]: uid,
        [EUser.phoneNumber]: phoneNumber,
      });
      if (!additionalUserInfo?.isNewUser && displayName !== null) {
        navigate(EScreen.DRAWER);
        return;
      }
      navigate(EScreen.SIGNUP_INFO);
    }
  }, [code, handleVerification, navigate, verificationId]);

  return (
    <ScreenBase
      desc={'Enter the 6-digit code sent to you at\n' + phone}
      onBack={goBack}
      onNext={handleNext}>
      <CustomInput
        value={code}
        onChangeText={setCode}
        field="phone"
        inputMode="numeric"
        onEndEditing={handleNext}
        valueStyle={st.text_medium_24}
        maxLength={6}
      />
    </ScreenBase>
  );
};

export default ConfirmPhoneNumberScreen;
