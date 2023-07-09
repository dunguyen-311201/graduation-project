import {CustomText, ScreenBase} from '@components';
import React, {useEffect} from 'react';

import {EScreen} from '@enums';
import {RootScreenNavigationProps} from '@navigation';
import {useNavigation} from '@react-navigation/native';

const SettingsScreen = () => {
  const {setOptions, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.MESSAGES>>();

  useEffect(() => {
    setOptions({headerShown: false});
  }, []);

  return (
    <ScreenBase onBack={goBack} title="Setting" flexHeader="row">
      <CustomText text="Setting Screen" />
    </ScreenBase>
  );
};

export default SettingsScreen;
