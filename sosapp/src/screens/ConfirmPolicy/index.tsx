import {Image, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import {EScreen} from '@enums';
import {ProfileIcon} from '@theme';
import {CustomText, ScreenBase} from '@components';
import {firebase} from '@react-native-firebase/firestore';
import {RootScreenNavigationProps} from '@navigation';

const ConfirmPolicyScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_POLICY>>();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _onNext = useCallback(async () => {
    firebase
      .firestore()
      .collection('users')
      .add({
        name: 'Ada Lovelace',
        age: 30,
      })
      .then(() => {
        console.log('User added!');
      });

    navigate(EScreen.DRAWER);
  }, [navigate]);

  return (
    <ScreenBase onBack={goBack} onNext={_onNext}>
      <View style={styles.content}>
        <View style={styles.boxProfile}>
          <Image source={ProfileIcon} />
        </View>

        <CustomText
          text={
            "By tapping the arrow below, you agree to SOS's Terms of Use and acknowledge that you have read the Privacy Policy"
          }
          type="text_small_5_16"
        />

        <CustomText
          text={
            'Check the box to indicate that you are atleast 18 years of age, agree to the'
          }
          type="text_small_5_14">
          <CustomText text={' Terms & Conditions '} type="text_small_5_14" />
          {'and acknowledge the '}
          <CustomText text={' Privacy Policy.'} type="text_small_5_14" />
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
  desc: {marginTop: 121},
  wrapText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
