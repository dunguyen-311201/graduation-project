import {CustomText, ScreenBase} from '@components';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';

import {Context} from '@context';
import {EScreen} from '@enums';
import {LIGHT_BLUE_COLOR, ProfileIcon, WHITE_COLOR} from '@theme';
import {RootScreenNavigationProps} from '@navigation';
import {useNavigation} from '@react-navigation/native';

const ConfirmPolicyScreen = () => {
  const {setOptions} =
    useNavigation<RootScreenNavigationProps<EScreen.CONFIRM_POLICY>>();
  const {signUp, loading} = useContext(Context);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const handleNext = useCallback(async () => {
    await signUp();
  }, []);

  return (
    <ScreenBase
      onNext={handleNext}
      nextTitle="Agree and continue"
      disableNext={!agreed}
      loading={loading}>
      <View style={styles.content}>
        <View style={styles.boxProfile}>
          <Image source={ProfileIcon} />
        </View>

        <Pressable
          style={styles.agree}
          onPress={() => setAgreed(prev => !prev)}
          accessibilityRole="checkbox"
          accessibilityState={{checked: agreed}}>
          <View style={[styles.checkbox, agreed && styles.checked]}>
            {agreed && <CustomText text="✓" type="text_medium_14" />}
          </View>
          <CustomText
            customStyle={styles.desc}
            text="I am at least 18 years old, agree to the"
            type="text_medium_16">
            <CustomText
              text=" Terms & Conditions "
              type="text_medium_16"
              color="blue"
            />
            {'and acknowledge the'}
            <CustomText
              text=" Privacy Policy."
              type="text_medium_16"
              color="blue"
            />
          </CustomText>
        </Pressable>
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
    marginTop: 64,
  },
  agree: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 12,
    marginTop: 48,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: WHITE_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: LIGHT_BLUE_COLOR,
    borderColor: LIGHT_BLUE_COLOR,
  },
  desc: {flex: 1},
});
