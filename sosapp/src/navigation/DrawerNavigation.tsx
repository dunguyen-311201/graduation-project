import React, {useCallback} from 'react';
import {
  DrawerContentComponentProps,
  createDrawerNavigator,
} from '@react-navigation/drawer';

import {StyleSheet} from 'react-native';
import {SettingsScreen, MessagesScreen, HomeScreen} from '@screens';

import DrawerContent from './DrawerContent';
import {EScreen} from '@enums';
import {BACKGROUND_COLOR, DARK_GRAY_COLOR, WHITE_COLOR} from '@theme';

export type DrawerParamList = {
  [EScreen.SETTINGS]: undefined;
  [EScreen.MESSAGES]: undefined;
  [EScreen.HOME]: undefined;
  [EScreen.HELP]: undefined;
};

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
      <Drawer.Screen
        name={EScreen.MESSAGES}
        options={{
          title: EScreen.MESSAGES.split('-')[0],
          drawerLabelStyle: {...styles.title},
        }}
        component={MessagesScreen}
      />
      <Drawer.Screen
        name={EScreen.HELP}
        options={{
          title: EScreen.HELP.split('-')[0],
          drawerLabelStyle: {...styles.title},
        }}
        component={MessagesScreen}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({
  title: {
    textTransform: 'capitalize',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
