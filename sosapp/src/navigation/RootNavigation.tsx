import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  ConfirmPhoneNumberScreen,
  HomeScreen,
  SignupBySocialScreen,
  SignupByPhoneNumberScreen,
  SplashScreen,
  SetupNameScreen,
  ConfirmPolicyScreen,
} from '../screens';
import {NativeStackNavigationProp} from '@react-navigation/native-stack/lib/typescript/src/types';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {EScreen} from '@enums/EScreen';
import MapScreen from '@screens/Map';

export type RootStackParamList = {
  [EScreen.SPLASH]: undefined;
  [EScreen.HOME]: undefined;
  [EScreen.SIGNUP_BY_PHONE_NUMBER]: undefined;
  [EScreen.SIGNUP_BY_SOCIAL]: undefined;
  [EScreen.SIGNUP_NAME]: undefined;
  [EScreen.CONFIRM_POLICY]: undefined;
  [EScreen.CONFIRM_PHONE_NUMBER]: {
    confirmation: FirebaseAuthTypes.ConfirmationResult;
    phone: string;
  };
  [EScreen.MAP]: {};
};

export type RootScreenNavigationProps<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigation = () => {
  return (
    <NavigationContainer>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
