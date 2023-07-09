import {
  BACKGROUND_COLOR,
  DARK_GRAY_COLOR,
  TEXT_COLOR,
  WHITE_COLOR,
} from '@theme';
import {
  DrawerContentComponentProps,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {HomeScreen, SettingsScreen} from '@screens';
import React, {useCallback} from 'react';

import DrawerContent from './DrawerContent';
import {EScreen} from '@enums';
import {StyleSheet} from 'react-native';

export type DrawerParamList = {
  [EScreen.HOME]: undefined;
  [EScreen.SETTINGS]: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigation = () => {
  const renderContent = useCallback(
    (props: DrawerContentComponentProps) => <DrawerContent {...props} />,
    [],
  );

  return (
    <Drawer.Navigator
      drawerContent={renderContent}
      screenOptions={{
        headerTitleStyle: {
          color: WHITE_COLOR,
          fontWeight: '500',
          fontSize: 22,
        },
        unmountOnBlur: true,
        headerTintColor: DARK_GRAY_COLOR,
        title: '',
        headerStyle: {
          backgroundColor: BACKGROUND_COLOR,
        },
        headerShown: false,
      }}>
      <Drawer.Screen
        name={EScreen.HOME}
        options={{
          title: 'Home',
          drawerLabelStyle: {...styles.title},
        }}
        component={HomeScreen}
      />

      <Drawer.Screen
        name={EScreen.SETTINGS}
        options={{
          title: 'Setting',
          drawerLabelStyle: {...styles.title},
        }}
        component={SettingsScreen}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({
  title: {
    textTransform: 'capitalize',
    fontSize: 20,
    fontWeight: '400',
    color: TEXT_COLOR,
  },
});
