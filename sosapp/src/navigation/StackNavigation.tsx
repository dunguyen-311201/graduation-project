import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import {HomeScreen, MapScreen, SendDistreeSignal} from '../screens';
import {EScreen} from '@enums';

export type StackParamList = {
  [EScreen.SPLASH]: undefined;
  [EScreen.HOME]: undefined;
  [EScreen.SIGNUP_BY_PHONE_NUMBER]: undefined;
  [EScreen.SIGNUP_BY_SOCIAL]: undefined;
  [EScreen.SIGNUP_NAME]: undefined;
  [EScreen.CONFIRM_POLICY]: undefined;
  [EScreen.CONFIRM_PHONE_NUMBER]: {
    phone: string;
    confirm: (phone: string) => Promise<void>;
  };
  [EScreen.MAP]: undefined;
  [EScreen.SEND_DISTRESS_SIGNAL]: undefined;
  [EScreen.SIGN_UP]: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName={EScreen.SPLASH}>
      <Stack.Screen name={EScreen.HOME} component={HomeScreen} />
      <Stack.Screen name={EScreen.MAP} component={MapScreen} />
      <Stack.Screen
        name={EScreen.SEND_DISTRESS_SIGNAL}
        component={SendDistreeSignal}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
