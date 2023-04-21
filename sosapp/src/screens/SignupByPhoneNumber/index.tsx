import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {ScreenBase, CustomText} from '@components';
import {ArrowRightBlueIcon} from '@theme';
import PhoneInput from './components/PhoneInput';
import {EScreen} from '@enums';
import {PHONES} from '@constants';
import {Nation} from '@types';
import {RootScreenNavigationProps} from '@navigation';
import {useAuth} from '@hooks';

const SignupByPhoneNumberScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const [nation, setNation] = useState<Nation>({...PHONES[0]});

  const [phone, setPhone] = useState('');

  const {signupByPhoneNumber} = useAuth();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const handleNext = useCallback(async () => {
    const textPhone = `${nation.code}${phone}`;
    const verificationId = await signupByPhoneNumber(textPhone);
    if (verificationId !== null) {
      navigate(EScreen.CONFIRM_PHONE_NUMBER, {
        phone: textPhone,
        verificationId,
      });
    }
  }, [nation.code, navigate, phone, signupByPhoneNumber]);

  const handleNavigateSocial = useCallback(() => {
    navigate(EScreen.SIGNUP_BY_SOCIAL);
  }, [navigate]);

  return (
    <ScreenBase
      title="Enter your mobile number"
      onBack={goBack}
      onNext={handleNext}>
      <PhoneInput
        nation={nation}
        phone={phone}
        onEndEditing={handleNext}
        onChangeNation={setNation}
        onChangePhone={setPhone}
      />
      <TouchableOpacity
        style={styles.buttonToSocial}
        onPress={handleNavigateSocial}
        disabled={phone.length === 9}>
        <CustomText
          text="Or connect with social"
          type="text_medium_light_blue_24"
        />
        <Image source={ArrowRightBlueIcon} style={styles.iconSocial} />
      </TouchableOpacity>
    </ScreenBase>
  );
};

export default SignupByPhoneNumberScreen;

const styles = StyleSheet.create({
  buttonToSocial: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },
  iconSocial: {
    marginLeft: 10,
  },
});
