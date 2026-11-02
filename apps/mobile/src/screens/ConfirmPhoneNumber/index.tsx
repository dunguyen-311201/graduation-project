import React, {useCallback, useContext, useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {
  linkWithCredential,
  PhoneAuthProvider,
  signInWithCredential,
  signInWithPhoneNumber,
} from '@react-native-firebase/auth';

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
  const {goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const {phone, verificationId: firstVerificationId} =
    useRoute<ConfirmRoute>().params || {};

  const [verificationId, setVerificationId] = useState(firstVerificationId);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);

  const {pendingStep, refreshAuth, signIn} = useContext(Context);

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

  const handleNext = useCallback(async () => {
    try {
      setLoading(true);

      const credential = PhoneAuthProvider.credential(verificationId, code);

      const linking = pendingStep === 'phone' && auth.currentUser;
      const {user} = linking
        ? await linkWithCredential(auth.currentUser!, credential)
        : await signInWithCredential(auth, credential);

      if (linking) {
        await refreshAuth();
      }

      // Without a profile the auth state opens the setup screens.
      if ((await getDoc(doc(db, 'users', user.uid))).exists()) {
        await signIn(user.uid);
      }
    } catch (err: any) {
      setError(
        err?.code === 'auth/credential-already-in-use'
          ? 'This number already belongs to another account.'
          : 'Please check your sms credentials and try again!',
      );
    }
    setLoading(false);
  }, [code, pendingStep, refreshAuth, signIn, verificationId]);

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
