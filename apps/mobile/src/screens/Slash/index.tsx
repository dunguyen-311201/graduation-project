import {ArrowRightIcon, CheckShieldIcon} from '@theme';
import {
  CustomButton,
  CustomLinearGradient,
  CustomText,
  Shadow,
} from '@components';
import React, {memo, useCallback, useContext, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';

import {Context} from '@context';
import {EScreen} from '@enums';
import {FIRST_INSTALLED} from '@constants';
import {RootScreenNavigationProps} from '@navigation';
import {getAsyncStorage} from '@utils';
import {useNavigation} from '@react-navigation/native';

function SplashScreen() {
  const {navigate} = useNavigation<RootScreenNavigationProps<EScreen.SPLASH>>();

  const {isAuthenticated, loading, notify} = useContext(Context);
  const [firstSignedIn, setFirstSignedIn] = useState(false);

  useEffect(() => {
    const setup = async () => {
      const cache = await getAsyncStorage(FIRST_INSTALLED);
      setFirstSignedIn(cache === null);
    };

    setup();
  }, [isAuthenticated]);

  useEffect(() => {
    if (firstSignedIn) {
      return;
    }

    if (!loading) {
      if (notify) {
        notify.background && navigate(EScreen.DETAIL_MESSAGE, notify);
        return;
      }

      if (isAuthenticated) {
        navigate(EScreen.DRAWER);
        return;
      }
      navigate(EScreen.SIGNUP_BY_PHONE_NUMBER);
    }
  }, [firstSignedIn, isAuthenticated, loading]);

  const handlePressStart = useCallback(() => {
    navigate(EScreen.SIGNUP_BY_PHONE_NUMBER);
  }, []);


  return (
    <CustomLinearGradient customStyle={styles.flex}>
      <SafeAreaView style={[styles.container, styles.flex]}>
        <View style={styles.top}>
          <Shadow customStyle={styles['box-logo']}>
            <CustomText text="SOS" type="text_large_64" />
          </Shadow>

          {firstSignedIn && (
            <CustomButton
              label="More with safety"
              type="outline"
              icon={CheckShieldIcon}
            />
          )}
        </View>
        {firstSignedIn && (
          <CustomButton
            label="Get Started"
            type="primary"
            icon={ArrowRightIcon}
            onPress={handlePressStart}
            customStyle={styles.button}
          />
        )}
      </SafeAreaView>
    </CustomLinearGradient>
  );
}

export default memo(SplashScreen);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 32,
    paddingTop: '50%',
    paddingBottom: 62,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  top: {
    alignItems: 'center',
    rowGap: 41,
  },
  button: {
    flexDirection: 'row',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    columnGap: 20,
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
