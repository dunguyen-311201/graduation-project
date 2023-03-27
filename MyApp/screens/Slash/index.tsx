import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RootScreenNavigationProps} from '../../navigation/RootNavigation';
import {EBUTTON, SCREEN} from '../../enums';

import {ArrowRight, Check} from '../../themes';
import {CustomButton, CustomLinearGradient} from '../../components';
import CustomText from '../../components/common/Text';

const SlashScreen = () => {
  const {navigate, setOptions} =
    useNavigation<RootScreenNavigationProps<SCREEN.SLASH_SCREEN>>();

  useEffect(() => {
    setOptions({
      headerShown: false,
    });
  }, [setOptions]);

  const handleNavigateToSignupByPhone = useCallback(() => {
    navigate(SCREEN.SIGN_UP_BY_PHONE_NUMBER);
  }, [navigate]);

  return (
    <CustomLinearGradient flex customStyle={styles.container}>
      <CustomLinearGradient
        borderRadius={20}
        customStyle={[styles.box, styles.shadow1]}>
        <CustomLinearGradient
          borderRadius={20}
          customStyle={[styles.box, styles.shadow2]}>
          <CustomText text="SOS" bold size="large" />
        </CustomLinearGradient>
      </CustomLinearGradient>

      <View>
        <CustomButton label="Move with safety" type={EBUTTON.OUTLINE}>
          <CustomText text="Move with safety" bold />
          <Image source={Check} style={styles.checkIcon} />
        </CustomButton>
      </View>

      <CustomLinearGradient
        borderRadius={10}
        customStyle={[styles.shadow1]}
        maxWidth>
        <CustomLinearGradient
          borderRadius={20}
          customStyle={[styles.shadow2]}
          maxWidth>
          <CustomButton
            customStyle={styles.getStartbutton}
            onPress={handleNavigateToSignupByPhone}>
            <Text style={styles.textButton}>Get Started</Text>
            <Image source={ArrowRight} style={styles.arrowIcon} />
          </CustomButton>
        </CustomLinearGradient>
      </CustomLinearGradient>
    </CustomLinearGradient>
  );
};

export default SlashScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 284,
    paddingHorizontal: 36,
    paddingBottom: 62,
  },
  box: {
    width: 181,
    height: 181,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow1: {
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      height: 4,
      width: 4,
    },
    shadowColor: '#000',
    shadowOpacity: 0.25,
  },
  shadow2: {
    elevation: 2,
    shadowOffset: {
      height: -4,
      width: -4,
    },
    shadowRadius: 10,
    shadowColor: '#BDBDBD',
    shadowOpacity: 0.4,
  },
  boxText: {
    color: '#FFFFFF',
    fontFamily: 'Open Sans',
    fontWeight: '600',
    fontSize: 64,
  },
  getStartbutton: {
    paddingVertical: 6,
  },
  textButton: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
  },
  arrowIcon: {
    marginLeft: 38,
  },
  checkIcon: {marginLeft: 5},
});
