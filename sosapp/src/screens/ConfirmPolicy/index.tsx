import {Image, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';

import {EScreen} from '@enums';
import {ProfileIcon} from '@theme';
import {CustomText, ScreenBase} from '@components';
import {RootScreenNavigationProps} from '@navigation';
import {Context} from '@context';

const ConfirmPolicyScreen = () => {
  const {setOptions} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_POLICY>>();
  const {signUp} = useContext(Context);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const handleNext = useCallback(async () => {
    setLoading(true);
    try {
      await signUp();
    } catch (error) {}
    setLoading(false);
  }, []);

  return (
    <ScreenBase onNext={handleNext} loading={loading}>
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
