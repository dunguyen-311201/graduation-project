import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  ConfirmPhoneNumberScreen,
  SignupBySocialScreen,
  SignupByPhoneNumberScreen,
  SplashScreen,
  SetupNameScreen,
  ConfirmPolicyScreen,
  SignupScreen,
} from '../screens';
import {EScreen} from '@enums';

export type StackParamList = {
  [EScreen.SPLASH]: undefined;
  [EScreen.SIGNUP_BY_PHONE_NUMBER]: undefined;
  [EScreen.SIGNUP_BY_SOCIAL]: undefined;
  [EScreen.SIGNUP_NAME]: undefined;
  [EScreen.CONFIRM_POLICY]: undefined;
  [EScreen.CONFIRM_PHONE_NUMBER]: {
    phone: string;
    confirm: (phone: string) => Promise<void>;
  };

  [EScreen.SIGN_UP]: undefined;
  ['Draw']: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

const StartNavigation = () => {
  return (
    <Stack.Navigator initialRouteName={EScreen.SPLASH}>
      <Stack.Screen
        name={EScreen.SPLASH}
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name={EScreen.SIGN_UP} component={SignupScreen} />
      <Stack.Screen
        name={EScreen.SIGNUP_BY_PHONE_NUMBER}
        component={SignupByPhoneNumberScreen}
      />

      <Stack.Screen
        name={EScreen.SIGNUP_BY_SOCIAL}
        component={SignupBySocialScreen}
      />
      <Stack.Screen
        name={EScreen.CONFIRM_PHONE_NUMBER}
        component={ConfirmPhoneNumberScreen}
      />
      <Stack.Screen name={EScreen.SIGNUP_NAME} component={SetupNameScreen} />
      <Stack.Screen
        name={EScreen.CONFIRM_POLICY}
        component={ConfirmPolicyScreen}
      />
    </Stack.Navigator>
  );
};

export default StartNavigation;
