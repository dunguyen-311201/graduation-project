import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import RootNavigation from './RootNavigation';
import {StackParamList} from './StackNavigation';

export type StackScreenNavigationProps<T extends keyof StackParamList> =
  NativeStackNavigationProp<StackParamList, T>;
export {RootNavigation};
