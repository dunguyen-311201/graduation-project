import {StyleSheet, View, Switch} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {EScreen} from '@enums';
import {RootScreenNavigationProps} from '@navigation';
import {CustomText, ScreenBase} from '@components';
import {getAsyncStorage, setAsyncStorage} from '@utils';
import {CURRENT_LOCATION, USER_CACHE} from '@constants';
import {Location, TUser} from '@types';

const SignupRescueService = () => {
  const {navigate, setOptions} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNUP_RESCUE_SERVICE>>();

  const [focusable, setFocusable] = useState(false);

  useEffect(() => {
    setOptions({headerShown: true});
  }, [setOptions]);

  const handleNext = useCallback(async () => {
    if (focusable) {
      const deviceLocation = await getAsyncStorage<Location>(CURRENT_LOCATION);
      if (deviceLocation) {
        await setAsyncStorage<TUser>(USER_CACHE, {
          location: deviceLocation,
          isRescue: focusable,
        });
      }
    }

    navigate(EScreen.SIGNUP_INFO, {isRescue: focusable});
  }, [focusable, navigate]);

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
