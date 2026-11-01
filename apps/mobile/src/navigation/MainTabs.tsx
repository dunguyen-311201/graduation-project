import {Image, ImageSourcePropType, StyleSheet} from 'react-native';
import {
  BellIcon,
  GoMapIcon,
  MWorkerIcon,
  MessageIcon,
  ProfileIcon,
  tokens,
} from '@theme';
import {ERole, EScreen} from '@enums';
import {
  HomeScreen,
  MessagesScreen,
  NotificationScreen,
  SettingsScreen,
  WorkerScreen,
} from '@screens';
import React, {useContext} from 'react';

import {Context} from '@context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const {colors} = tokens;

export type MainTabParamList = {
  [EScreen.HOME]: undefined;
  [EScreen.TAB_REQUESTS]: undefined;
  [EScreen.TAB_WORKERS]: undefined;
  [EScreen.TAB_ALERTS]: undefined;
  [EScreen.SETTINGS]: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcon =
  (source: ImageSourcePropType) =>
  ({color}: {color: string}) => (
    <Image source={source} style={[styles.icon, {tintColor: color}]} />
  );

// Bottom tabs per role replace the old drawer. Keeps the route name
// EScreen.DRAWER in the root stack so existing navigate() calls still work.
const MainTabs = () => {
  const {currentUser} = useContext(Context);
  const isCenter = currentUser?.role === ERole.CENTER;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.bar,
        tabBarLabelStyle: styles.label,
      }}>
      <Tab.Screen
        name={EScreen.HOME}
        component={HomeScreen}
        options={{title: 'Home', tabBarIcon: tabIcon(GoMapIcon)}}
      />
      <Tab.Screen
        name={EScreen.TAB_REQUESTS}
        component={MessagesScreen}
        options={{title: 'Requests', tabBarIcon: tabIcon(MessageIcon)}}
      />
      {isCenter && (
        <Tab.Screen
          name={EScreen.TAB_WORKERS}
          component={WorkerScreen}
          options={{title: 'Workers', tabBarIcon: tabIcon(MWorkerIcon)}}
        />
      )}
      <Tab.Screen
        name={EScreen.TAB_ALERTS}
        component={NotificationScreen}
        options={{title: 'Alerts', tabBarIcon: tabIcon(BellIcon)}}
      />
      <Tab.Screen
        name={EScreen.SETTINGS}
        component={SettingsScreen}
        options={{title: 'Profile', tabBarIcon: tabIcon(ProfileIcon)}}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    height: 64,
    paddingTop: 6,
    paddingBottom: 8,
  },
  label: {fontSize: 12, fontWeight: '600'},
  icon: {width: 24, height: 24, resizeMode: 'contain'},
});
