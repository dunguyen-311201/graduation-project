import {StyleSheet, View, Switch} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {EScreen} from '@enums';
import {RootScreenNavigationProps} from '@navigation';
import {CustomText, ScreenBase} from '@components';
import {Context} from '@context';
import {setAsyncStorage} from '@utils';
import {USER_CACHE} from '@constants';
import {TUser} from '@types';

const SignupRescueService = () => {
  const {navigate, setOptions} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNUP_RESCUE_SERVICE>>();

  const {deviceLocation} = useContext(Context);

  const [focusable, setFocusable] = useState(false);

  useEffect(() => {
    setOptions({headerShown: true});
  }, [setOptions]);

  const handleNext = useCallback(async () => {
    await setAsyncStorage<TUser>(USER_CACHE, {
      location: deviceLocation,
    });

    navigate(EScreen.SIGNUP_INFO, {isRescue: focusable});
  }, [deviceLocation, focusable, navigate]);

  return (
    <ScreenBase title="Do you want to help people?" onNext={handleNext}>
      <View style={styles.group}>
        <CustomText
          text="You want to turn on join the rescue"
          type="text_medium_18"
          color="blue"
        />
        <Switch
          value={focusable}
          onValueChange={() => setFocusable(prev => !prev)}
        />
      </View>
    </ScreenBase>
  );
};

export default SignupRescueService;

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
