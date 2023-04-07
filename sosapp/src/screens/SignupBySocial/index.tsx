import {StyleSheet} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import {StackScreenNavigationProps} from '@navigation';
import {ScreenBase, Social} from '@components';
import {EScreen} from '@enums/EScreen';
import {FacebookIcon, GoogleIcon} from '@theme';
import {useAuth} from '@hooks/useAuth';

const SignupBySocialScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<StackScreenNavigationProps<EScreen.SIGNUP_BY_SOCIAL>>();

  const {signupByGoogle, signupByFacebook} = useAuth();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _navigateNext = useCallback(() => {
    navigate(EScreen.HOME);
  }, [navigate]);

  const handleSignupFacebook = useCallback(async () => {
    await signupByFacebook();
  }, [signupByFacebook]);

  const handleSignupGoogle = useCallback(async () => {
    await signupByGoogle();
  }, [signupByGoogle]);

  return (
    <ScreenBase
      title="Choose an account"
      onBack={goBack}
      onNext={_navigateNext}>
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
    </ScreenBase>
  );
};

export default SignupBySocialScreen;

const styles = StyleSheet.create({
  social: {
    marginBottom: 20,
    marginLeft: 16,
  },
});
