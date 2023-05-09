import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {
  CustomButton,
  CustomLinearGradient,
  Shadow,
  CustomText,
} from '@components';
import {ArrowRightIcon, CheckShieldIcon} from '@theme';
import {RootScreenNavigationProps} from '@navigation';
import {EScreen} from '@enums';
import {getAsyncStorage} from '@utils/asyncStorage';
import {FIRST_INSTALLED} from '@constants';
import {useAuth} from '@hooks';
import {checkSignup} from '@utils';

function SplashScreen() {
  const {navigate} = useNavigation<RootScreenNavigationProps<EScreen.SPLASH>>();
  const [isNew, setIsNew] = useState(false);

  const {currentUser} = useAuth();

  useEffect(() => {
    const setup = async () => {
      const _isNew = await getAsyncStorage(FIRST_INSTALLED);

      if (_isNew === null) {
        setIsNew(true);
        return;
      }

      if (currentUser !== null && (await checkSignup(currentUser.uid))) {
        navigate(EScreen.DRAWER);
        return;
      }

      if (currentUser === null) {
        navigate(EScreen.SIGNUP_BY_PHONE_NUMBER);
      }
    };

    setup();
  }, [currentUser, navigate]);

  const _navigateNext = useCallback(() => {
    navigate(EScreen.SIGNUP_BY_PHONE_NUMBER);
  }, [navigate]);

  return (
    <CustomLinearGradient customStyle={styles.flex}>
      <SafeAreaView style={[styles.container, styles.flex]}>
        <View style={styles.top}>
          <Shadow customStyle={styles['box-logo']}>
            <CustomText text="SOS" type="text_large_64" />
          </Shadow>

          {isNew && (
            <CustomButton
              label="More with safety"
              type="outline"
              icon={CheckShieldIcon}
              customStyle={styles.topButton}
            />
          )}
        </View>
        {isNew && (
          <CustomButton
            label="Get Started"
            type="primary"
            icon={ArrowRightIcon}
            onPress={_navigateNext}
          />
        )}
      </SafeAreaView>
    </CustomLinearGradient>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 32,
    paddingTop: 282,
    paddingBottom: 62,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  top: {
    alignItems: 'center',
  },
  topButton: {marginTop: 41},
  button: {
    flexDirection: 'row',
    borderRadius: 10,
  },
  ['box-logo']: {
    width: 181,
    height: 181,
    borderRadius: 20,
  },
  img: {
    marginLeft: 20,
  },
});
