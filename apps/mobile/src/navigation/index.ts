import {DrawerParamList} from './DrawerNavigation';
import {StackNavigationProp} from '@react-navigation/stack';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import RootNavigation, {RootParamList} from './RootNavigation';
import {CompositeNavigationProp} from '@react-navigation/native';

export type RootScreenNavigationProps<T extends keyof RootParamList> =
  CompositeNavigationProp<
    StackNavigationProp<RootParamList, T>,
    DrawerNavigationProp<DrawerParamList>
  >;

export type RootTabScreenNavigationProps<T extends keyof RootParamList> =
  StackNavigationProp<RootParamList, T>;

export {RootNavigation};
