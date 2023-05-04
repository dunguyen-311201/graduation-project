import React, {useCallback, useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import {ScreenBase, CustomInput} from '@components';
import {EScreen} from '@enums';
import {RootScreenNavigationProps} from '@navigation';
import {handleUpdateInfo, handleVerification, Styles as st} from '@utils';
import {RootParamList} from '@navigation/RootNavigation';

type ConfirmRoute = RouteProp<RootParamList, EScreen.CONFIRM_PHONE_NUMBER>;

const ConfirmPhoneNumberScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const {phone, verificationId} = useRoute<ConfirmRoute>().params || {};

  const [code, setCode] = useState('');

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const handleNext = useCallback(async () => {
    const userCredential = await handleVerification(verificationId, code);
    if (userCredential !== null) {
      const {additionalUserInfo, user} = userCredential;
      if (additionalUserInfo && additionalUserInfo.isNewUser) {
        navigate(EScreen.SIGNUP_INFO);
        return;
      }

      if (additionalUserInfo === undefined) {
        return;
      }

      const token = await messaging().getToken();
      await handleUpdateInfo({token, uid: user.uid});
      navigate(EScreen.DRAWER);
    }
  }, [code, navigate, verificationId]);

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
