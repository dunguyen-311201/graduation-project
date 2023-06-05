import {
  DrawerContentComponentProps,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';

import {EScreen} from '@enums';
import DrawerContent from './DrawerContent';
import {
  BACKGROUND_COLOR,
  DARK_GRAY_COLOR,
  TEXT_COLOR,
  WHITE_COLOR,
} from '@theme';
import {SettingsScreen, HomeScreen} from '@screens';

const Drawer = createDrawerNavigator();

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
        headerTintColor: DARK_GRAY_COLOR,
        title: '',
        headerStyle: {
          backgroundColor: BACKGROUND_COLOR,
        },
      }}>
      <Drawer.Screen
        name={EScreen.HOME}
        options={{
          title: EScreen.HOME.split('-')[0],
          drawerLabelStyle: {...styles.title},
        }}
        component={HomeScreen}
      />
      <Drawer.Screen
        name={EScreen.SETTINGS}
        options={{
          title: EScreen.SETTINGS.split('-')[0],
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
