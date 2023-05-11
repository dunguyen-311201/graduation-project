import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';

import {
  CustomButton,
  CustomLinearGradient,
  Shadow,
  CustomText,
} from '@components';
import {EScreen} from '@enums';
import {FIRST_INSTALLED} from '@constants';
import {getAsyncStorage} from '@utils';
import {RootScreenNavigationProps} from '@navigation';
import {ArrowRightIcon, CheckShieldIcon} from '@theme';
import {Context} from '@context/index';

function SplashScreen() {
  const {navigate} = useNavigation<RootScreenNavigationProps<EScreen.SPLASH>>();

  const [isNew, setIsNew] = useState(false);

  const {isAuthenticated, isCompleted, onCompleted} = useContext(Context);
  useEffect(() => {
    const setup = async () => {
      const isFirst = await getAsyncStorage(FIRST_INSTALLED);

      if (!isFirst) {
        setIsNew(true);
        return;
      }

      if (isAuthenticated) {
        navigate(EScreen.DRAWER);
        return;
      }
      navigate(EScreen.SIGNUP_BY_PHONE_NUMBER);
      onCompleted(false);
    };

    if (isCompleted) {
      setup();
    }
  }, [isAuthenticated, isCompleted, navigate, onCompleted]);

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
