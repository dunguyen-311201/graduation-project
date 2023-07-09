import {FacebookIcon, GmailIcon, GoogleIcon} from '@theme';
import React, {useCallback, useEffect} from 'react';
import {ScreenBase, Social} from '@components';
import {StyleSheet, View} from 'react-native';

import {EScreen} from '@enums';
import {RootScreenNavigationProps} from '@navigation';
import {useNavigation} from '@react-navigation/native';

const SignupBySocialScreen = () => {
  const {navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNUP_BY_SOCIAL>>();

  const handleSignupFacebook = useCallback(async () => {}, []);

  const handleSignupGoogle = useCallback(async () => {}, []);

  const handleSignInByEmail = useCallback(async () => {
    navigate(EScreen.SIGNIN_BY_EMAIL);
  }, []);

  return (
    <ScreenBase title="Choose an account" onBack={goBack}>
      <View style={styles.container}>
        <Social
          title="Facebook"
          icon={FacebookIcon}
          customStyle={styles.social}
          onPress={handleSignupFacebook}
        />

        <Social
          title="Google"
          icon={GoogleIcon}
          customStyle={styles.social}
          onPress={handleSignupGoogle}
        />
        <Social
          title="Gmail"
          icon={GmailIcon}
          customStyle={styles.social}
          onPress={handleSignInByEmail}
        />
      </View>
    </ScreenBase>
  );
};

export default SignupBySocialScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
  },
  social: {
    marginBottom: 20,
    marginLeft: 16,
  },
});
