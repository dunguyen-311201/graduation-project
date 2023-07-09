import {View, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useContext, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import firebase from '@react-native-firebase/firestore';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import {EScreen} from '@enums';
import {Context} from '@context';
import {ScreenBase} from '@components';
import ComfirmInput from './components/ComfirmInput';
import {RootScreenNavigationProps} from '@navigation';
import {RootParamList} from '@navigation/RootNavigation';

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
          const u = await firebase()
            .doc('users/' + user.uid)
            .get();

          if (!u.exists) {
            navigate(EScreen.SIGNUP_INFO);
          } else {
            await signIn(user.uid);
          }
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
