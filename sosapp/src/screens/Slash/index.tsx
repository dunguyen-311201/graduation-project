import React, {useCallback, useEffect} from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';

import {CustomButton, CustomLinearGradient, CustomText} from '@components';
import {ArrowRightIcon, CheckShieldIcon} from '@theme/icon';
import Shadow from '@components/Shadow';
import {useNavigation} from '@react-navigation/native';
import {StackScreenNavigationProps} from '@navigation';
import {EScreen} from '@enums';

import {useAuth} from '../../hooks';

import {isAuthenticated} from '@utils';

function SplashScreen() {
  const {setOptions, navigate, reset} =
    useNavigation<StackScreenNavigationProps<EScreen.SPLASH>>();

  const {user} = useAuth();

  useEffect(() => {
    setOptions({headerShown: false});

    if (isAuthenticated()) {
      navigate(EScreen.HOME);
      reset({index: 0, routes: [{name: EScreen.HOME}]});
    }
  }, [setOptions, navigate, user, reset]);

  const _navigateNext = useCallback(() => {
    navigate(EScreen.SIGNUP_BY_PHONE_NUMBER);
  }, [navigate]);

  return (
    <CustomLinearGradient customStyle={styles['linearGradient-container']}>
      <SafeAreaView style={styles.container}>
        <View style={styles.top}>
          <Shadow customStyle={styles['box-logo']}>
            <CustomText text="SOS" type="text_large_white" />
          </Shadow>

          <CustomButton type="outline" customStyle={styles.topButtom}>
            <CustomText text="Move with safety" type="text_regular_white" />
            <Image source={CheckShieldIcon} />
          </CustomButton>
        </View>

        <CustomButton type="primary" onPress={_navigateNext}>
          <CustomText text="Get Started" type="text_large_7_white" />
          <Image source={ArrowRightIcon} style={styles.img} />
        </CustomButton>
      </SafeAreaView>
    </CustomLinearGradient>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  ['linearGradient-container']: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 282,
    paddingBottom: 62,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  top: {
    alignItems: 'center',
  },
  topButtom: {marginTop: 41},
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
