import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import RootNavigation from './RootNavigation';
import {StackParamList} from './StackNavigation';

export type RootScreenNavigationProps<T extends keyof StackParamList> =
  CompositeNavigationProp<
    NativeStackNavigationProp<StackParamList, T>,
    StackNavigationProp<StackParamList, T>
  >;
export {RootNavigation};
