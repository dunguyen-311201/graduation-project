import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  ConfirmPhoneNumberScreen,
  HomeScreen,
  SignupByGoogleOrFacebookScreen,
  SignupByPhoneNumberScreen,
  SplashScreen,
} from '../screens';
import {NativeStackNavigationProp} from '@react-navigation/native-stack/lib/typescript/src/types';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  SignupByPhoneNumber: undefined;
  SignupByGoogleOrFacebook: undefined;
  ConfirmPhoneNumber: undefined;
};

export type RootScreenNavigationProps<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="SignupByPhoneNumber"
          component={SignupByPhoneNumberScreen}
        />
        <Stack.Screen
          name="SignupByGoogleOrFacebook"
          component={SignupByGoogleOrFacebookScreen}
        />
        <Stack.Screen
          name="ConfirmPhoneNumber"
          component={ConfirmPhoneNumberScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
