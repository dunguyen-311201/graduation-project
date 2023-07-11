import React, {useCallback, useContext, useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import ComfirmInput from './components/ComfirmInput';
import {Context} from '@context';
import {EScreen} from '@enums';
import {RootParamList} from '@navigation/RootNavigation';
import {RootScreenNavigationProps} from '@navigation';
import {ScreenBase} from '@components';
import firebase from '@react-native-firebase/firestore';

type ConfirmRoute = RouteProp<RootParamList, EScreen.CONFIRM_PHONE_NUMBER>;

const ConfirmPhoneNumberScreen = () => {
  const {navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const {phone, verificationId} = useRoute<ConfirmRoute>().params || {};

  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const {signIn} = useContext(Context);

  const onAuthStateChanged = useCallback(
    async (user: FirebaseAuthTypes.User | null) => {
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
    },
    [],
  );

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [onAuthStateChanged]);

  const handleNext = useCallback(async () => {
    try {
      setLoading(true);

      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        code,
      );

      const userCredential = await auth().signInWithCredential(credential);

      if (userCredential) {
        const {user} = userCredential;

        const u = await firebase()
          .doc('users/' + user.uid)
          .get();

        if (!u.exists) {
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
