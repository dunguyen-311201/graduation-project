import React, {useCallback, useContext, useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {EScreen} from '@enums';
import {Context} from '@context';
import {Error, Loading, ScreenBase} from '@components';
import ComfirmInput from './components/ComfirmInput';
import {RootScreenNavigationProps} from '@navigation';
import {RootParamList} from '@navigation/RootNavigation';
import {handleLastLogin} from '@utils';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {PHONES_TEST} from '@constants';

type ConfirmRoute = RouteProp<RootParamList, EScreen.CONFIRM_PHONE_NUMBER>;

const ConfirmPhoneNumberScreen = () => {
  const {navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const {phone, verificationId} = useRoute<ConfirmRoute>().params || {};

  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const {onAuthenticated} = useContext(Context);

  const [isDisible, setIsDisabled] = useState(true);

  const onAuthStateChanged = useCallback(
    (user: FirebaseAuthTypes.User | null) => {
      if (user) {
        if (user.displayName) {
          onAuthenticated(true);
        } else {
          navigate(EScreen.SIGNUP_INFO);
        }
      } else {
        setIsDisabled(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (code.length === 6) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
    if (phone && !PHONES_TEST.includes(phone)) {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber;
    }
  }, [code, onAuthStateChanged, phone]);

  const handleNext = useCallback(async () => {
    if (!isDisible) {
      setLoading(true);
      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        code,
      );
      const userCredential = await auth().signInWithCredential(credential);

      if (userCredential) {
        const {additionalUserInfo} = userCredential;

        if (additionalUserInfo?.isNewUser) {
          setLoading(false);
          navigate(EScreen.SIGNUP_INFO);
          return;
        }

        await handleLastLogin();
        onAuthenticated(true);
        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
      }
    }
  }, [code, isDisible]);

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
        onNext={handleNext}
        disableNext={isDisible}>
        <ComfirmInput code={code} onChange={setCode} onFocus={handleFocus} />
      </ScreenBase>
    </>
  );
};

export default ConfirmPhoneNumberScreen;
