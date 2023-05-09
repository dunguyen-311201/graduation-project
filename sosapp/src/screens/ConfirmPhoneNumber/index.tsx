import React, {useCallback, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {EScreen} from '@enums';
import {Loading, ScreenBase} from '@components';
import {FIRST_INSTALLED} from '@constants';
import ComfirmInput from './components/ComfirmInput';
import {RootScreenNavigationProps} from '@navigation';
import {RootParamList} from '@navigation/RootNavigation';
import {
  getDeviceToken,
  handleUpdateInfo,
  handleVerification,
  setAsyncStorage,
} from '@utils';

type ConfirmRoute = RouteProp<RootParamList, EScreen.CONFIRM_PHONE_NUMBER>;

const ConfirmPhoneNumberScreen = () => {
  const {navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const {phone, verificationId} = useRoute<ConfirmRoute>().params || {};

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = useCallback(async () => {
    setLoading(true);
    try {
      const userCredential = await handleVerification(verificationId, code);
      if (userCredential !== null) {
        const {additionalUserInfo, user} = userCredential;

        if (additionalUserInfo === undefined) {
          return;
        }

        if (additionalUserInfo && additionalUserInfo.isNewUser) {
          navigate(EScreen.SIGNUP_RESCUE_SERVICE);
          return;
        }

        const token = await getDeviceToken();
        await handleUpdateInfo({token, uid: user.uid, lastLogin: Date.now()});
        await setAsyncStorage(FIRST_INSTALLED, 1);
        navigate(EScreen.DRAWER);
      }
    } catch (error) {
      console.log('Comfirm error: ' + error);
    }
    setLoading(false);
  }, [code, navigate, verificationId]);

  return (
    <ScreenBase
      desc={'Enter the 6-digit code sent to you at\n' + phone}
      onNext={handleNext}>
      {loading && <Loading />}
      <ComfirmInput code={code} onChange={setCode} />
    </ScreenBase>
  );
};

export default ConfirmPhoneNumberScreen;
