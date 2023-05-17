import {StackNavigationProp} from '@react-navigation/stack';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

import {DrawerParamList} from './DrawerNavigation';
import {BottomParamList} from './TabBottomNavigation';
import RootNavigation, {RootParamList} from './RootNavigation';

export type RootScreenNavigationProps<T extends keyof RootParamList> =
  CompositeNavigationProp<
    StackNavigationProp<RootParamList, T>,
    DrawerNavigationProp<DrawerParamList>
  >;

export type RootTabScreenNavigationProps<T extends keyof RootParamList> =
  CompositeNavigationProp<
    StackNavigationProp<RootParamList, T>,
    BottomTabNavigationProp<BottomParamList>
  >;

export {RootNavigation};
