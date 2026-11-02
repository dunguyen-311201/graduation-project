import {CustomText, ScreenBase} from '@components';
import {Pressable, StyleSheet, View} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';

import {Context} from '@context';
import {EScreen} from '@enums';
import {RootScreenNavigationProps} from '@navigation';
import {useNavigation} from '@react-navigation/native';
import {colors as themeColors, themedStyles} from '../../theme/tokens';

const ConfirmPolicyScreen = () => {
  const {setOptions, navigate} =
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
      title="One last step"
      desc="Read and accept the terms to start using SOS."
      onNext={handleNext}
      nextTitle="Agree and continue"
      disableNext={!agreed}
      loading={loading}>
      <View style={styles.content}>
        <Pressable
          style={styles.agree}
          onPress={() => setAgreed(prev => !prev)}
          accessibilityRole="checkbox"
          accessibilityState={{checked: agreed}}>
          <View style={[styles.checkbox, agreed && styles.checked]}>
            {agreed && (
              <CustomText
                text="✓"
                type="text_medium_14"
                customStyle={{color: themeColors.onPrimary, fontWeight: '700'}}
              />
            )}
          </View>
          <CustomText
            customStyle={styles.desc}
            text="I am at least 18 years old, agree to the"
            type="text_medium_16">
            <CustomText
              text=" Terms & Conditions "
              type="text_medium_16"
              color="blue"
              onPress={() => navigate(EScreen.PRIVACY_LEGAL)}
            />
            {'and acknowledge the'}
            <CustomText
              text=" Privacy Policy."
              type="text_medium_16"
              color="blue"
              onPress={() => navigate(EScreen.PRIVACY_LEGAL)}
            />
          </CustomText>
        </Pressable>
      </View>
    </ScreenBase>
  );
};

export default ConfirmPolicyScreen;

const styles = themedStyles(() => StyleSheet.create({
  content: {
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
  },
  boxProfile: {
    height: 138,
    width: 138,
    borderRadius: 69,
    backgroundColor: themeColors.surfaceRaised,
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
    borderColor: themeColors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: themeColors.primary,
    borderColor: themeColors.primary,
  },
  desc: {flex: 1},
}));
