import {Image, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {CustomButton, CustomText, NationSelect} from '../../components';
import {ArrowRight2, LIGHT_BLACK_COLOR, LIGHT_BLUE_COLOR} from '../../themes';
import {NationProps} from '../../types';
import {PHONES} from '../../constants';
import PhoneInput from './components/PhoneInput';
import {useNavigation} from '@react-navigation/native';
import {RootScreenNavigationProps} from '../../navigation/RootNavigation';
import {EBUTTON, SCREEN} from '../../enums';
import ArrowLeft from '../../components/Icons/ArrowLeft';

const SignUpByPhoneNumberScreen = () => {
  const [isSelectNation, setIsSelectNation] = useState(false);
  const [nation, setNation] = useState<NationProps>(PHONES[0]);

  const [phone, setPhone] = useState('');

  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<SCREEN.SIGN_UP_BY_PHONE_NUMBER>>();

  useEffect(() => {
    setOptions({
      headerShown: false,
    });
  }, [setOptions]);

  const backPress = useCallback(() => {
    navigate(SCREEN.SLASH_SCREEN);
  }, [navigate]);

  const _onVisibleDropDown = useCallback(() => {
    setIsSelectNation(prev => !prev);
  }, []);

  const _onChangeNation = useCallback(
    (code: string) => {
      const newState = PHONES.find(
        _phone => _phone.code === code && _phone.code !== nation.code,
      );
      if (newState) {
        setNation(newState);
      }
      setIsSelectNation(false);
    },
    [nation.code],
  );

  return (
    <View style={styles.container}>
      <View>
        <ArrowLeft onPress={backPress} />

        <CustomText
          text="Enter your mobile number"
          size="elarge"
          customStyle={styles.title}
        />

        <View style={styles.phoneGroup}>
          <PhoneInput
            onVisibleDropDown={_onVisibleDropDown}
            {...nation}
            feild="phone"
            onChangeText={value => {
              setPhone(value);
            }}
            value={phone}
          />

          {isSelectNation && <NationSelect onChangeNation={_onChangeNation} />}
        </View>

        <View style={styles.socialGroup}>
          <CustomText
            text="Or connect with social"
            size="xnormal"
            customStyle={styles.socialText}
          />

          <Image source={ArrowRight2} />
        </View>
      </View>
      <View>
        <CustomText
          text="By continuing you may recieve an SMS for
        verification. Message and data rates may apply."
        />
        <CustomButton label="Next" type={EBUTTON.OUTLINE} />
      </View>
    </View>
  );
};

export default SignUpByPhoneNumberScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 36,
    backgroundColor: LIGHT_BLACK_COLOR,
    justifyContent: 'space-between',
  },
  title: {
    paddingTop: 36,
  },
  phoneGroup: {
    width: '100%',
    marginTop: 30,
  },
  socialGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 23,
  },
  socialText: {
    color: LIGHT_BLUE_COLOR,
    marginRight: 15,
  },
});
