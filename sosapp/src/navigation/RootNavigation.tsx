import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import StartNavigation from './StartNavigation';
import {EScreen} from '@enums/EScreen';
import DrawerNavigation from './DrawerNavigation';

export type RootParamList = {
  [EScreen.DRAWER]: undefined;
  [EScreen.START]: undefined;
};

const RootNavigation = () => {
  const Stack = createStackNavigator<RootParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={EScreen.START}>
        <Stack.Screen
          name={EScreen.DRAWER}
          component={DrawerNavigation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={EScreen.START}
          component={StartNavigation}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
