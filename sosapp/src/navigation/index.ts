import {DrawerParamList} from './DrawerNavigation';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {DrawerNavigationProp} from '@react-navigation/drawer';

import RootNavigation, {RootParamList} from './RootNavigation';

export type RootScreenNavigationProps<T extends keyof RootParamList> =
  CompositeNavigationProp<
    StackNavigationProp<RootParamList, T>,
    DrawerNavigationProp<DrawerParamList>
  >;

export {RootNavigation};
