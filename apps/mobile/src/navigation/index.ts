import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp} from '@react-navigation/native';
import {MainTabParamList} from './MainTabs';
import RootNavigation, {RootParamList} from './RootNavigation';
import {StackNavigationProp} from '@react-navigation/stack';

export type RootScreenNavigationProps<T extends keyof RootParamList> =
  CompositeNavigationProp<
    StackNavigationProp<RootParamList, T>,
    BottomTabNavigationProp<MainTabParamList>
  >;

export type RootTabScreenNavigationProps<T extends keyof RootParamList> =
  StackNavigationProp<RootParamList, T>;

export {RootNavigation};
