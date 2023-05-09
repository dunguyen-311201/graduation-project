import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {ScreenBase, CustomText, Loading} from '@components';
import {ArrowRightBlueIcon} from '@theme';
import PhoneInput from './components/PhoneInput';
import {EScreen} from '@enums';
import {PHONES} from '@constants';
import {Nation} from '@types';
import {RootScreenNavigationProps} from '@navigation';
import {signupByPhoneNumber} from '@utils';

const SignupByPhoneNumberScreen = () => {
  const {navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const [loading, setLoading] = useState(false);

  const [nation, setNation] = useState<Nation>({...PHONES[0]});

  const [phone, setPhone] = useState('');

  const handleNext = useCallback(async () => {
    setLoading(true);
    try {
      const textPhone = `${nation.code}${phone}`;
      const verificationId = await signupByPhoneNumber(textPhone);

      if (verificationId !== null) {
        navigate(EScreen.CONFIRM_PHONE_NUMBER, {
          phone: textPhone,
          verificationId,
        });
      }
    } catch (error) {
      console.log('Valid phone number error: ' + error);
    }
    setLoading(false);
  }, [nation.code, navigate, phone]);

  const handleNavigateSocial = useCallback(() => {
    navigate(EScreen.SIGNUP_BY_SOCIAL);
  }, [navigate]);

  const handleChangePhone = useCallback((value: string) => {
    const formattedValue = value.replace(/[^0-9]/g, '');
    let formattedPhoneNumber = formattedValue.replace(
      /(\d{3})(\d{3})(\d{3})/,
      '$1 $2 $3',
    );
    setPhone(formattedPhoneNumber);
  }, []);

  return (
    <ScreenBase title="Enter your phone number" onNext={handleNext}>
      {loading && <Loading />}
      <PhoneInput
        nation={nation}
        phone={phone}
        onEndEditing={handleNext}
        onChangeNation={setNation}
        onChangePhone={handleChangePhone}
      />
      <TouchableOpacity
        style={styles.buttonToSocial}
        onPress={handleNavigateSocial}
        disabled={phone.length === 9}>
        <CustomText
          text="Or connect with social"
          type="text_medium_24"
          color="blue"
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
