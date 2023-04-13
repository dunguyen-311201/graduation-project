import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import {RootScreenNavigationProps} from '@navigation';
import {ScreenBase, CustomText} from '@components';
import {ArrowRightBlueIcon} from '@theme';
import PhoneInput from './components/PhoneInput';
import {EScreen} from '@enums';
import {PHONES} from '@constants';
import {Nation} from '@types';

const SignupByPhoneNumberScreen = () => {
  const [phone, setPhone] = useState('');

  const [comfirmation, setConfirmation] =
    useState<FirebaseAuthTypes.ConfirmationResult>();

  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const [nation, setNation] = useState<Nation>({...PHONES[0]});

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const handleAuth = useCallback(
    async (verificationCode: string) => {
      if (comfirmation) {
        const credential = auth.PhoneAuthProvider.credential(
          comfirmation.verificationId,
          verificationCode,
        );
        await auth().signInWithCredential(credential);
      }
    },
    [comfirmation],
  );

  const _navigateNext = useCallback(async () => {
    const confirmation = await auth().signInWithPhoneNumber(
      `${nation.code}${phone}`,
    );

    setConfirmation(confirmation);

    navigate(EScreen.CONFIRM_PHONE_NUMBER, {
      phone,
      confirm: handleAuth,
    });
  }, [nation.code, navigate, phone, handleAuth]);

  const _navigateSocial = useCallback(() => {
    navigate(EScreen.SIGNUP_BY_SOCIAL);
  }, [navigate]);

  const handleChangePhone = useCallback((_phone: string) => {
    setPhone(_phone);
  }, []);

  const handleChangeNation = useCallback((code: string) => {
    const na = PHONES.find(item => item.code === code);
    if (na) {
      setNation(na);
    }
  }, []);

  return (
    <ScreenBase
      title="Enter your mobile number"
      onBack={goBack}
      onNext={_navigateNext}>
      <PhoneInput
        nation={nation}
        phone={phone}
        onChangeNation={handleChangeNation}
        onChangePhone={handleChangePhone}
      />
      <TouchableOpacity style={styles.buttonToSocial} onPress={_navigateSocial}>
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
