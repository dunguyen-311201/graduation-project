import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {HomeScreen, SlashScreen} from '../screens';

import {SCREEN} from '../enums';

type RootListParams = {
  [SCREEN.HOME_SCREEN]: undefined;
  [SCREEN.MAP_SCREEN]: undefined;
  [SCREEN.SLASH_SCREEN]: undefined;
};

export type RootScreenNavigationProps<T extends keyof RootListParams> =
  NativeStackNavigationProp<RootListParams, T>;

const RootNavigation = () => {
  const Stack = createNativeStackNavigator<RootListParams>();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={SCREEN.SLASH_SCREEN}>
        <Stack.Screen name={SCREEN.SLASH_SCREEN} component={SlashScreen} />
        <Stack.Screen name={SCREEN.HOME_SCREEN} component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
