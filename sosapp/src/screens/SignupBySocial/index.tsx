import {StyleSheet} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import {RootScreenNavigationProps} from '@navigation';
import {ScreenBase, Social} from '@components';
import {EScreen} from '@enums/EScreen';
import {FacebookIcon, GoogleIcon} from '@theme';

const SignupBySocialScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNUP_BY_SOCIAL>>();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _navigateNext = useCallback(() => {
    navigate(EScreen.HOME);
  }, [navigate]);

  const handleSignupFacebook = useCallback(async () => {}, []);

  const handleSignupGoogle = useCallback(async () => {}, []);

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
