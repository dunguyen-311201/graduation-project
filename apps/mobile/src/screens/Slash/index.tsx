import {CheckShieldIcon} from '@theme';
import {
  CustomLinearGradient,
  CustomText,
  Shadow,
} from '@components';
import React, {memo, useEffect, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';

import {FIRST_INSTALLED} from '@constants';
import {getAsyncStorage} from '@utils';
import {colors as themeColors, themedStyles} from '../../theme/tokens';

function SplashScreen() {
  const [firstSignedIn, setFirstSignedIn] = useState(false);

  useEffect(() => {
    const setup = async () => {
      const cache = await getAsyncStorage(FIRST_INSTALLED);
      setFirstSignedIn(cache === null);
    };

    setup();
  }, []);


  return (
    <CustomLinearGradient customStyle={styles.flex}>
      <SafeAreaView style={[styles.container, styles.flex]}>
        <View style={styles.top}>
          <Shadow customStyle={styles['box-logo']}>
            <CustomText
              text="SOS"
              type="text_large_64"
              customStyle={{color: themeColors.onPrimary}}
            />
          </Shadow>

          {firstSignedIn && (
            <View style={styles.tagline} accessible>
              <CustomText
                text="Move with safety"
                type="text_large_20"
                customStyle={{color: themeColors.onPrimary}}
              />
              <Image
                source={CheckShieldIcon}
                style={{tintColor: themeColors.onPrimary}}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </CustomLinearGradient>
  );
}

export default memo(SplashScreen);

const styles = themedStyles(() => StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 32,
    paddingTop: '30%',
    paddingBottom: 62,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  top: {
    alignItems: 'center',
    rowGap: 41,
  },
  tagline: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
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
}));
