import RootNavigation, {RootParamList} from './RootNavigation';

import {BottomParamList} from './TabBottomNavigation';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {DrawerParamList} from './DrawerNavigation';
import {StackNavigationProp} from '@react-navigation/stack';

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
