import React, {useCallback, useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {doc, getDoc} from '@react-native-firebase/firestore';

import {Context} from '@context';
import {EScreen} from '@enums';
import {signInWithGoogle} from '@features/auth';
import {AppButton, Error, ScreenBase, Social} from '@components';
import {RootScreenNavigationProps} from '@navigation';
import {db} from '@services';
import {GmailIcon} from '@theme';
import {themedStyles} from '../../theme/tokens';

const SignupBySocialScreen = () => {
  const {navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNUP_BY_SOCIAL>>();

  const {signIn} = useContext(Context);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleGoogle = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const user = await signInWithGoogle();
      // A new account continues on the phone step that the auth state opens.
      if (
        user?.phoneNumber &&
        (await getDoc(doc(db, 'users', user.uid))).exists()
      ) {
        await signIn(user.uid);
      }
    } catch (err) {
      setError('Could not sign in with Google. Please try again.');
    }
    setLoading(false);
  }, [signIn]);

  const handleRescueTeam = useCallback(() => {
    navigate(EScreen.SIGNIN_BY_EMAIL);
  }, [navigate]);

  return (
    <ScreenBase
      title="Choose an account"
      desc="You will confirm your phone number next."
      onBack={goBack}
      loading={loading}>
      <View style={styles.container}>
        <Social
          title="Continue with Google"
          icon={GmailIcon}
          customStyle={styles.social}
          onPress={handleGoogle}
        />
        {error && <Error message={error} />}
      </View>
      <AppButton
        label="Rescue team sign-in"
        variant="secondary"
        onPress={handleRescueTeam}
      />
    </ScreenBase>
  );
};

export default SignupBySocialScreen;

const styles = themedStyles(() => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  social: {
    marginBottom: 20,
    marginLeft: 16,
  },
}));
