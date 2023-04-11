import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import {StackScreenNavigationProps} from '@navigation';
import {ScreenBase, CustomText} from '@components';
import {ArrowRightBlueIcon} from '@theme';
import PhoneInput from './components/PhoneInput';
import {EScreen} from '@enums';
import {PHONES} from '@constants';
import {Context, ContextProps} from '@context';
import {Nation} from '@types';

const SignupByPhoneNumberScreen = () => {
  const {userProfile, setUserProfile} = useContext<ContextProps>(Context);

  const {setOptions, navigate, goBack} =
    useNavigation<StackScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const [nation, setNation] = useState<Nation>({...PHONES[0]});

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const handleVerification = async (
    verificationId: string,
    verificationCode: string,
  ) => {
    const credential = auth.PhoneAuthProvider.credential(
      verificationId,
      verificationCode,
    );
    await auth().signInWithCredential(credential);
  };

  const _navigateNext = useCallback(async () => {
    const confirmation = await auth().signInWithPhoneNumber(
      `${nation.code}${userProfile?.phone}`,
    );

    const verificationId = confirmation.verificationId;

    if (verificationId !== null) {
      navigate(EScreen.CONFIRM_PHONE_NUMBER, {
        confirm: async (code: string) => {
          handleVerification(verificationId, code);
        },
      });
    }
  }, [nation.code, navigate, userProfile?.phone]);

  const _navigateSocial = useCallback(() => {
    navigate(EScreen.SIGNUP_BY_SOCIAL);
  }, [navigate]);

  const handleChangePhone = useCallback(
    (phone: string) => {
      setUserProfile({...userProfile, phone});
    },
    [setUserProfile, userProfile],
  );
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
        phone={userProfile?.phone}
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
