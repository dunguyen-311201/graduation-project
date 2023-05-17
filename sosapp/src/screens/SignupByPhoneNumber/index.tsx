import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';

import {Nation} from '@types';
import {EScreen} from '@enums';
import {PHONE, PHONES} from '@constants';
import {ArrowRightBlueIcon} from '@theme';
import PhoneInput from './components/PhoneInput';
import {RootScreenNavigationProps} from '@navigation';
import {ScreenBase, CustomText, Loading, Error} from '@components';
import {getAsyncStorage, setAsyncStorage} from '@utils';
import {useAuth} from '@hooks';

const SignupByPhoneNumberScreen = () => {
  const {navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_PHONE_NUMBER>>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [nation, setNation] = useState<Nation>({...PHONES[0]});

  const [phone, setPhone] = useState('917874915');

  const {signInByPhoneNumber} = useAuth();

  useEffect(() => {
    const setup = async () => {
      const _phone = await getAsyncStorage<string>(PHONE);
      if (_phone !== null) {
        setPhone(_phone);
      }
    };

    setup();
  }, []);

  const handleNext = useCallback(async () => {
    setLoading(true);
    const textPhone = `${nation.code}${phone}`;
    const verificationId = await signInByPhoneNumber(textPhone);

    if (verificationId) {
      await setAsyncStorage(PHONE, phone);

      setLoading(false);

      navigate(EScreen.CONFIRM_PHONE_NUMBER, {
        phone: textPhone,
        verificationId,
      });
    } else {
      setError(true);
    }

    setLoading(false);
  }, [nation.code, phone]);

  const handleNavigateSocial = useCallback(() => {
    navigate(EScreen.SIGNUP_BY_SOCIAL);
  }, [navigate]);

  const handleChangePhone = useCallback(
    (value: string) => {
      if (error) {
        setError(false);
      }

      const formattedValue = value.replace(/[^0-9]/g, '');
      let formattedPhoneNumber = formattedValue.replace(
        /(\d{3})(\d{3})(\d{3})/,
        '$1 $2 $3',
      );
      setPhone(formattedPhoneNumber);
    },
    [error],
  );

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
      {error && <Error message="Please check your phone number!" />}
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
