import React, {useCallback, useContext, useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {
  onAuthStateChanged as onAuthChanged,
  PhoneAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import type {User} from '@react-native-firebase/auth';

import ComfirmInput from './components/ComfirmInput';
import {Context} from '@context';
import {EScreen} from '@enums';
import {RootParamList} from '@navigation/RootNavigation';
import {RootScreenNavigationProps} from '@navigation';
import {ScreenBase} from '@components';
import {doc, getDoc} from '@react-native-firebase/firestore';
import {auth, db} from '@services';

type ConfirmRoute = RouteProp<RootParamList, EScreen.CONFIRM_PHONE_NUMBER>;

const ConfirmPhoneNumberScreen = () => {
  const {navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const {phone, verificationId} = useRoute<ConfirmRoute>().params || {};

  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const {signIn} = useContext(Context);

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
    } catch (err) {}
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
  }, [code]);

  return (
    <ScreenBase
      loading={loading}
      onBack={goBack}
      title={'Enter The 6-Digit Code At\n' + phone}
      onNext={handleNext}>
      <View style={styles.content}>
        <ComfirmInput code={code} onChange={setCode} error={error} />
      </View>
    </ScreenBase>
  );
};

export default ConfirmPhoneNumberScreen;

const styles = StyleSheet.create({
  content: {
    marginTop: 20,
  },
});
