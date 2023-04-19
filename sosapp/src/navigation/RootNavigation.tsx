import React, {useContext, useMemo} from 'react';
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
  SetupInfoScreen,
  SignupByPhoneNumberScreen,
  SignupBySocialScreen,
} from '@screens';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useAuth} from '@hooks';
import {Context} from '@context/index';

export type RootParamList = {
  [EScreen.DRAWER]: undefined;
  [EScreen.SPLASH]: undefined;
  [EScreen.SIGNUP_BY_PHONE_NUMBER]: undefined;
  [EScreen.SIGNUP_BY_SOCIAL]: undefined;
  [EScreen.SIGNUP_INFO]: undefined;
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

  const {isFirstAuthenticated} = useContext(Context);

  const {currentUser} = useAuth();

  const initRoute = useMemo(() => {
    if (currentUser && currentUser.displayName !== null) {
      return EScreen.DRAWER;
    }

    if (isFirstAuthenticated) {
      return EScreen.SIGNUP_BY_PHONE_NUMBER;
    }

    return EScreen.SPLASH;
  }, [currentUser, isFirstAuthenticated]);

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
        <Stack.Screen name={EScreen.SIGNUP_INFO} component={SetupInfoScreen} />
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
