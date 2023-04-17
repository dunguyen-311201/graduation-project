import React, {useCallback, useEffect} from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';

import {CustomButton, CustomLinearGradient, CustomText} from '@components';
import {ArrowRightIcon, CheckShieldIcon} from '@theme/icon';
import Shadow from '@components/Shadow';
import {useNavigation} from '@react-navigation/native';
import {RootScreenNavigationProps} from '@navigation';
import {EScreen} from '@enums';
import {useAuth} from '@hooks';

type SplashProps = {
  isStart?: boolean;
};

function SplashScreen({isStart = true}: SplashProps) {
  const {navigate} = useNavigation<RootScreenNavigationProps<EScreen.SPLASH>>();

  const {currentUser} = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate(EScreen.DRAWER);
    }
  }, [currentUser, navigate]);

  const _navigateNext = useCallback(() => {
    navigate(EScreen.SIGNUP_BY_PHONE_NUMBER);
  }, [navigate]);

  return (
    <CustomLinearGradient customStyle={styles.flex}>
      <SafeAreaView style={[styles.container, styles.flex]}>
        <View style={styles.top}>
          <Shadow customStyle={styles['box-logo']}>
            <CustomText text="SOS" type="text_large_white" />
          </Shadow>

          {isStart && (
            <CustomButton type="outline" customStyle={styles.topButtom}>
              <CustomText text="Move with safety" type="text_regular_white" />
              <Image source={CheckShieldIcon} />
            </CustomButton>
          )}
        </View>

        {isStart && (
          <CustomButton type="primary" onPress={_navigateNext}>
            <CustomText text="Get Started" type="text_large_7_white" />
            <Image source={ArrowRightIcon} style={styles.img} />
          </CustomButton>
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
