import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {EScreen} from '@enums';
import {ScreenBase, Social} from '@components';
import {RootScreenNavigationProps} from '@navigation';
import {GmailIcon} from '@theme';
import {themedStyles} from '../../theme/tokens';

const SignupBySocialScreen = () => {
  const {navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNUP_BY_SOCIAL>>();

  const handleSignInByEmail = useCallback(async () => {
    navigate(EScreen.SIGNIN_BY_EMAIL);
  }, []);

  return (
    <ScreenBase title="Choose an account" onBack={goBack}>
      <View style={styles.container}>
        <Social
          title="Email"
          icon={GmailIcon}
          customStyle={styles.social}
          onPress={handleSignInByEmail}
        />
      </View>
    </ScreenBase>
  );
};

export default SignupBySocialScreen;

const styles = themedStyles(() => StyleSheet.create({
  container: {
    paddingTop: 30,
  },
  social: {
    marginBottom: 20,
    marginLeft: 16,
  },
}));
