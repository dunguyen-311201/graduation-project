import React, {useCallback, useContext, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {EScreen} from '@enums';
import {Context} from '@context';
import {FIRST_INSTALLED} from '@constants';
import {Error, Loading, ScreenBase} from '@components';
import ComfirmInput from './components/ComfirmInput';
import {RootScreenNavigationProps} from '@navigation';
import {RootParamList} from '@navigation/RootNavigation';
import {handleLastLogin, setAsyncStorage} from '@utils';
import {useAuth} from '@hooks';

type ConfirmRoute = RouteProp<RootParamList, EScreen.CONFIRM_PHONE_NUMBER>;

const ConfirmPhoneNumberScreen = () => {
  const {navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const {phone, verificationId} = useRoute<ConfirmRoute>().params || {};

  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const {verification} = useAuth();

  const {onAuthenticated} = useContext(Context);

  const handleNext = useCallback(async () => {
    setLoading(true);

    const userCredential = await verification(verificationId, code);

    if (userCredential) {
      const {additionalUserInfo} = userCredential;

      if (additionalUserInfo?.isNewUser) {
        setLoading(false);
        navigate(EScreen.SIGNUP_INFO);
        return;
      }

      await setAsyncStorage(FIRST_INSTALLED, 1);
      await handleLastLogin();
      onAuthenticated(true);
    } else {
      setError(true);
      setLoading(false);
    }
  }, [code, verificationId]);

  const handleFocus = useCallback(() => {
    if (error) {
      setError(false);
    }
  }, [error]);

  return (
    <>
      {error && <Error message="Please check your Digit code!" />}
      {loading && <Loading />}
      <ScreenBase
        desc={'Enter The 6-Digit Code At\n' + phone}
        onNext={handleNext}>
        <ComfirmInput code={code} onChange={setCode} onFocus={handleFocus} />
      </ScreenBase>
    </>
  );
};

export default ConfirmPhoneNumberScreen;
