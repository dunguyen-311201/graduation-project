import {Image, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RootScreenNavigationProps} from '@navigation/RootNavigation';
import {EScreen} from '@enums/EScreen';
import ScreenBase from '@components/ScreenBase';
import {ProfileIcon} from '@theme/icon';
import {CustomText} from '@components/common';

const ConfirmPolicyScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_POLICY>>();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _onNext = useCallback(() => {
    navigate(EScreen.HOME);
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
          type="regular"
        />

        <CustomText
          text={
            'Check the box to indicate that you are atleast 18 years of age, agree to the'
          }
          type="regular">
          <CustomText text={' Terms & Conditions '} type="regular" />
          {'and acknowledge the '}
          <CustomText text={' Privacy Policy.'} type="regular" />
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
