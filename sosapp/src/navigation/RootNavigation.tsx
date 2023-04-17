import React, {useMemo} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {EScreen} from '@enums/EScreen';
import DrawerNavigation from './DrawerNavigation';
import SplashScreen from '@screens/Slash';
import {
  ConfirmPhoneNumberScreen,
  ConfirmPolicyScreen,
  MapScreen,
  SendDistreeSignal,
  SetupNameScreen,
  SignupByPhoneNumberScreen,
  SignupBySocialScreen,
} from '@screens';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useAuth} from '@hooks';

export type RootParamList = {
  [EScreen.DRAWER]: undefined;
  [EScreen.SPLASH]: undefined;
  [EScreen.SIGNUP_BY_PHONE_NUMBER]: undefined;
  [EScreen.SIGNUP_BY_SOCIAL]: undefined;
  [EScreen.SIGNUP_NAME]: undefined;
  [EScreen.CONFIRM_POLICY]: undefined;
  [EScreen.CONFIRM_PHONE_NUMBER]: {
    phone: string;
    comfirmation: FirebaseAuthTypes.ConfirmationResult;
  };
  [EScreen.MAP]: undefined;
  [EScreen.SEND_DISTRESS_SIGNAL]: undefined;
};

const RootNavigation = () => {
  const Stack = createStackNavigator<RootParamList>();

  const {currentUser} = useAuth();

  const initRoute = useMemo(() => {
    if (!currentUser) {
      return EScreen.SPLASH;
    }
    return EScreen.DRAWER;
  }, [currentUser]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initRoute}>
        <Stack.Screen
          name={EScreen.DRAWER}
          component={DrawerNavigation}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name={EScreen.SPLASH}
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={EScreen.SIGNUP_BY_PHONE_NUMBER}
          component={SignupByPhoneNumberScreen}
        />

        <Stack.Screen
          name={EScreen.SIGNUP_BY_SOCIAL}
          component={SignupBySocialScreen}
        />
        <Stack.Screen
          name={EScreen.CONFIRM_PHONE_NUMBER}
          component={ConfirmPhoneNumberScreen}
        />
        <Stack.Screen name={EScreen.SIGNUP_NAME} component={SetupNameScreen} />
        <Stack.Screen
          name={EScreen.CONFIRM_POLICY}
          component={ConfirmPolicyScreen}
        />
        <Stack.Screen name={EScreen.MAP} component={MapScreen} />
        <Stack.Screen
          name={EScreen.SEND_DISTRESS_SIGNAL}
          component={SendDistreeSignal}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
