import {Image, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import {EScreen} from '@enums';
import {ProfileIcon} from '@theme';
import {CustomText, ScreenBase} from '@components';
import {RootScreenNavigationProps} from '@navigation';
import {
  getAsyncStorage,
  handleUpdateProfile,
  setAsyncStorage,
  signupInfo,
} from '@utils';
import {FIRST_INSTALLED, USER_CACHE} from '@constants';
import {TUser} from '@types';
import {useAuth} from '@hooks';

const ConfirmPolicyScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_POLICY>>();

  const {currentUser} = useAuth();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const handleNext = useCallback(async () => {
    const infoSetUp = await getAsyncStorage<TUser>(USER_CACHE);

    const token = await messaging().getToken();

    if (currentUser && infoSetUp !== null) {
      const {phoneNumber, uid} = currentUser;
      if (phoneNumber !== null) {
        await signupInfo({...infoSetUp, phoneNumber, uid, token});
        await handleUpdateProfile(
          `${infoSetUp.firstName} ${infoSetUp.lastName}`,
        );
        await setAsyncStorage(USER_CACHE, null);
      }
    }

    const isFirst = await getAsyncStorage(FIRST_INSTALLED);

    if (isFirst === null) {
      await setAsyncStorage(FIRST_INSTALLED, 1);
    }

    navigate(EScreen.DRAWER);
  }, [currentUser, navigate]);

  return (
    <ScreenBase onBack={goBack} onNext={handleNext}>
      <View style={styles.content}>
        <View style={styles.boxProfile}>
          <Image source={ProfileIcon} />
        </View>

        <CustomText
          customStyle={styles.title}
          text={
            "By tapping the arrow below, you agree to SOS's Terms of Use and acknowledge that you have read the Privacy Policy"
          }
          type="text_regular_20"
        />

        <CustomText
          customStyle={styles.desc}
          text={
            'Check the box to indicate that you are atleast 18 years of age, agree to the'
          }
          type="text_medium_14">
          <CustomText
            text={' Terms & Conditions '}
            type="text_medium_14"
            color="blue"
          />
          {'and acknowledge the '}
          <CustomText
            text={' Privacy Policy.'}
            type="text_medium_14"
            color="blue"
          />
        </CustomText>
      </View>
    </ScreenBase>
  );
};

export default ConfirmPolicyScreen;

const styles = StyleSheet.create({
  content: {
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
  },
  boxProfile: {
    height: 138,
    width: 138,
    borderRadius: 69,
    backgroundColor: '#C4C4C4',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 122,
  },
  title: {
    marginTop: 65,
  },
  desc: {marginTop: 141},
  wrapText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
