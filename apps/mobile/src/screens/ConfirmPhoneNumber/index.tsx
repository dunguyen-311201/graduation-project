import React, {useCallback, useContext, useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {
  onAuthStateChanged as onAuthChanged,
  PhoneAuthProvider,
  signInWithCredential,
  signInWithPhoneNumber,
} from '@react-native-firebase/auth';
import type {User} from '@react-native-firebase/auth';

import ComfirmInput from './components/ComfirmInput';
import {Context} from '@context';
import {EScreen} from '@enums';
import {RootParamList} from '@navigation/RootNavigation';
import {RootScreenNavigationProps} from '@navigation';
import {CustomButton, ScreenBase} from '@components';
import {doc, getDoc} from '@react-native-firebase/firestore';
import {auth, db} from '@services';
import {themedStyles} from '../../theme/tokens';

type ConfirmRoute = RouteProp<RootParamList, EScreen.CONFIRM_PHONE_NUMBER>;

const RESEND_SECONDS = 60;

const ConfirmPhoneNumberScreen = () => {
  const {navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const {phone, verificationId: firstVerificationId} =
    useRoute<ConfirmRoute>().params || {};

  const [verificationId, setVerificationId] = useState(firstVerificationId);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);

  const {signIn} = useContext(Context);

  useEffect(() => {
    if (resendIn <= 0) {
      return;
    }
    const timeId = setTimeout(() => setResendIn(prev => prev - 1), 1000);
    return () => clearTimeout(timeId);
  }, [resendIn]);

  const handleChangeCode = useCallback((value: string) => {
    setCode(value);
    setError(undefined);
  }, []);

  const handleResend = useCallback(async () => {
    try {
      setLoading(true);
      const result = await signInWithPhoneNumber(auth, phone);
      if (result.verificationId) {
        setVerificationId(result.verificationId);
        setResendIn(RESEND_SECONDS);
        setError(undefined);
      }
    } catch (err) {
      setError('Could not send a new code. Please try again later.');
    }
    setLoading(false);
  }, [phone]);

  const onAuthStateChanged = useCallback(async (user: User | null) => {
    try {
      setLoading(true);
      if (user) {
        if (user?.displayName && user.metadata.lastSignInTime) {
          await signIn(user.uid);
          return;
        }
        navigate(EScreen.SIGNUP_INFO);
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const subscriber = onAuthChanged(auth, onAuthStateChanged);
    return subscriber;
  }, [onAuthStateChanged]);

  const handleNext = useCallback(async () => {
    try {
      setLoading(true);

      const credential = PhoneAuthProvider.credential(verificationId, code);

      const userCredential = await signInWithCredential(auth, credential);

      if (userCredential) {
        const {user} = userCredential;

        const u = await getDoc(doc(db, 'users', user.uid));

        if (!u.exists()) {
          setLoading(false);
          navigate(EScreen.SIGNUP_INFO);
          return;
        }

        await signIn(user.uid);
      } else {
        setError('Please check your sms credentials and try again!');
      }
    } catch (err: any) {
      setError('Please check your sms credentials and try again!');
    }
    setLoading(false);
  }, [code, verificationId]);

  return (
    <ScreenBase
      loading={loading}
      onBack={goBack}
      title="Enter the code"
      desc={`We sent a 6-digit code to ${phone}`}
      onNext={handleNext}
      disableNext={code.length !== 6}>
      <View style={styles.content}>
        <ComfirmInput onChange={handleChangeCode} error={error} />
        <CustomButton
          type="secondary"
          label={resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend code'}
          disabled={resendIn > 0}
          onPress={handleResend}
        />
      </View>
    </ScreenBase>
  );
};

export default ConfirmPhoneNumberScreen;

const styles = themedStyles(() => StyleSheet.create({
  content: {
    marginTop: 20,
    rowGap: 16,
  },
}));
