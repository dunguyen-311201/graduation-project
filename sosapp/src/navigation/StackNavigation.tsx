import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

import {
  ConfirmPhoneNumberScreen,
  HomeScreen,
  SignupBySocialScreen,
  SignupByPhoneNumberScreen,
  SplashScreen,
  SetupNameScreen,
  ConfirmPolicyScreen,
  MapScreen,
  SendDistreeSignal,
} from '../screens';
import {EScreen} from '@enums';

export type StackParamList = {
  [EScreen.SPLASH]: undefined;
  [EScreen.HOME]: undefined;
  [EScreen.SIGNUP_BY_PHONE_NUMBER]: undefined;
  [EScreen.SIGNUP_BY_SOCIAL]: undefined;
  [EScreen.SIGNUP_NAME]: undefined;
  [EScreen.CONFIRM_POLICY]: undefined;
  [EScreen.CONFIRM_PHONE_NUMBER]: {
    confirmation: FirebaseAuthTypes.ConfirmationResult;
  };
  [EScreen.MAP]: undefined;
  [EScreen.SEND_DISTRESS_SIGNAL]: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

const RootNavigation = () => {
  return (
    <Stack.Navigator initialRouteName={EScreen.SPLASH}>
      <Stack.Screen name={EScreen.HOME} component={HomeScreen} />
      <Stack.Screen name={EScreen.SPLASH} component={SplashScreen} />
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
      <Stack.Screen name={EScreen.MAP} component={MapScreen} />
      <Stack.Screen
        name={EScreen.SEND_DISTRESS_SIGNAL}
        component={SendDistreeSignal}
      />
    </Stack.Navigator>
  );
};

export default RootNavigation;
