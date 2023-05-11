import React, {useCallback, useContext, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {EScreen} from '@enums';
import {Loading, ScreenBase} from '@components';
import ComfirmInput from './components/ComfirmInput';
import {RootScreenNavigationProps} from '@navigation';
import {RootParamList} from '@navigation/RootNavigation';
import {
  getDeviceToken,
  handleUpdateInfo,
  handleVerification,
  setAsyncStorage,
} from '@utils';
import {FIRST_INSTALLED} from '@constants';
import {Context} from '@context/index';

type ConfirmRoute = RouteProp<RootParamList, EScreen.CONFIRM_PHONE_NUMBER>;

const ConfirmPhoneNumberScreen = () => {
  const {navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const {phone, verificationId} = useRoute<ConfirmRoute>().params || {};

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const {onAuthenticated} = useContext(Context);

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
          setLoading(false);
          navigate(EScreen.SIGNUP_INFO);
          return;
        }
        const token = await getDeviceToken();
        await handleUpdateInfo({
          uid: user.uid,
          token,
          lastLogin: Date.now(),
        });
        await setAsyncStorage(FIRST_INSTALLED, 1);
      }
    } catch (error) {
      console.log('Comfirm error: ' + error);
    }
    setLoading(false);

    onAuthenticated(true);
  }, [code, navigate, onAuthenticated, verificationId]);

  return (
    <>
      {loading && <Loading />}
      <ScreenBase
        desc={'Enter the 6-digit code sent to you at\n' + phone}
        onNext={handleNext}>
        <ComfirmInput code={code} onChange={setCode} />
      </ScreenBase>
    </>
  );
};

export default ConfirmPhoneNumberScreen;
