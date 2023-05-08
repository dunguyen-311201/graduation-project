import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {EScreen} from '@enums';
import DrawerNavigation from './DrawerNavigation';
import {
  SplashScreen,
  ConfirmPhoneNumberScreen,
  ConfirmPolicyScreen,
  MapScreen,
  SendDistreeSignal,
  SetupInfoScreen,
  SignupByPhoneNumberScreen,
  SignupBySocialScreen,
  DetailMessageScreen,
  SignupRescueServiceScreen,
} from '@screens';
import {Location} from '@types';
import {BACKGROUND_COLOR, DARK_GRAY_COLOR, WHITE_COLOR} from '@theme';
import {Context} from '@context';

export type RootParamList = {
  [EScreen.DRAWER]: undefined;
  [EScreen.SPLASH]: undefined;
  [EScreen.SIGNUP_BY_PHONE_NUMBER]: undefined;
  [EScreen.SIGNUP_BY_SOCIAL]: undefined;
  [EScreen.SIGNUP_INFO]: {isRescue: boolean};
  [EScreen.CONFIRM_POLICY]: undefined;
  [EScreen.CONFIRM_PHONE_NUMBER]: {
    phone: string;
    verificationId: string;
  };
  [EScreen.MAP]: {initLocation?: Location};
  [EScreen.SEND_DISTRESS_SIGNAL]: undefined;
  [EScreen.DETAIL_MESSAGE]: {uid: string};
  [EScreen.SIGNUP_RESCUE_SERVICE]: undefined;
};

const RootNavigation = () => {
  const Stack = createStackNavigator<RootParamList>();
  const {initRoute} = useContext(Context);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initRoute}
        screenOptions={{
          headerTitleStyle: {
            color: WHITE_COLOR,
            fontWeight: '500',
            fontSize: 22,
          },
          headerTintColor: DARK_GRAY_COLOR,
          title: '',
          headerStyle: {
            backgroundColor: BACKGROUND_COLOR,
          },
        }}>
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
          name={EScreen.SIGNUP_RESCUE_SERVICE}
          component={SignupRescueServiceScreen}
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
        <Stack.Screen
          name={EScreen.DETAIL_MESSAGE}
          component={DetailMessageScreen}
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
