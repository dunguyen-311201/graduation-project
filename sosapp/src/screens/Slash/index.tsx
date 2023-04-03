import React, {useCallback, useEffect} from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';

import {CustomButton, CustomLinearGradient, CustomText} from '@components';
import {ArrowRightIcon, CheckShieldIcon} from '@theme/icon';
import Shadow from '@components/Shadow';
import {useNavigation} from '@react-navigation/native';
import {RootScreenNavigationProps} from '@navigation/RootNavigation';
import {EScreen} from '@enums';

function SplashScreen() {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.SPLASH>>();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _navigateNext = useCallback(() => {
    navigate(EScreen.SIGNUP_BY_PHONE_NUMBER);
  }, [navigate]);

  return (
    <CustomLinearGradient customStyle={styles['linearGradient-container']}>
      <SafeAreaView style={styles.container}>
        <View style={styles.top}>
          <Shadow customStyle={styles['box-logo']}>
            <CustomText text="SOS" style={['fs16', 'fw7']} />
          </Shadow>

          <CustomButton type="outline" customStyle={styles.topButtom}>
            <CustomText text="Move with safety" style={['fs5', 'fw6']} />
            <Image source={CheckShieldIcon} />
          </CustomButton>
        </View>

        <CustomButton type="primary" onPress={_navigateNext}>
          <CustomText text="Get Started" style={['fs52', 'fw7']} />
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
