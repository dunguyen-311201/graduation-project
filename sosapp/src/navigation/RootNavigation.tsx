import {
  AddNewWorkerScreen,
  AssignScreen,
  ConfirmPhoneNumberScreen,
  ConfirmPolicyScreen,
  DetailMessageScreen,
  MapScreen,
  MessagesScreen,
  NotificationScreen,
  SendDistreeSignal,
  SetupInfoScreen,
  SignInByEmailScreen,
  SignupByPhoneNumberScreen,
  SignupBySocialScreen,
  SplashScreen,
  WorkerScreen,
} from '@screens';
import {BACKGROUND_COLOR, DARK_GRAY_COLOR, WHITE_COLOR} from '@theme';
import {ERole, EScreen} from '@enums';
import React, {useContext} from 'react';

import {Context} from '@context';
import DrawerNavigation from './DrawerNavigation';
import {Location} from '@types';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

export type RootParamList = {
  [EScreen.DRAWER]: undefined;
  [EScreen.SIGNUP_BY_PHONE_NUMBER]: undefined;
  [EScreen.SIGNUP_BY_SOCIAL]: undefined;
  [EScreen.SIGNUP_INFO]: undefined;
  [EScreen.CONFIRM_POLICY]: undefined;
  [EScreen.CONFIRM_PHONE_NUMBER]: {
    phone: string;
    verificationId: string;
  };
  [EScreen.MAP]?: {
    to: Location | null;
    distance?: string;
    timeout?: string;
  };
  [EScreen.SEND_DISTRESS_SIGNAL]: {onNew?: (mess: any) => Promise<void>};
  [EScreen.DETAIL_MESSAGE]: {
    id: string;
    onReject?: () => Promise<void>;
    onDelete?: (id: string) => Promise<void>;
  };
  [EScreen.SIGNIN_BY_EMAIL]: undefined;
  [EScreen.WORKER]: undefined;
  [EScreen.NEW_WORKER]: undefined;
  [EScreen.MESSAGES]?: {workerID?: string; mode?: boolean};
  [EScreen.PENDING_MESSAGE]: undefined;
  [EScreen.SPLASH]: undefined;
  [EScreen.NOTIFICATION]: undefined;
  [EScreen.ASSIGN]: {id: string};
};

const RootNavigation = () => {
  const Stack = createStackNavigator<RootParamList>();

  const {isAuthenticated, currentUser} = useContext(Context);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={EScreen.SPLASH}
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
          name={EScreen.SPLASH}
          component={SplashScreen}
          options={{headerShown: false}}
        />

        {isAuthenticated ? (
          <>
            {currentUser?.role === ERole.CENTER && (
              <>
                <Stack.Screen
                  name={EScreen.WORKER}
                  options={{headerShown: false}}
                  component={WorkerScreen}
                />
                <Stack.Screen
                  name={EScreen.ASSIGN}
                  options={{headerShown: false}}
                  component={AssignScreen}
                />
                <Stack.Screen
                  name={EScreen.NEW_WORKER}
                  component={AddNewWorkerScreen}
                />
              </>
            )}

            <Stack.Screen
              name={EScreen.DETAIL_MESSAGE}
              component={DetailMessageScreen}
            />

            <Stack.Screen
              name={EScreen.MESSAGES}
              component={MessagesScreen}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name={EScreen.NOTIFICATION}
              component={NotificationScreen}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name={EScreen.DRAWER}
              component={DrawerNavigation}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name={EScreen.MAP}
              component={MapScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={EScreen.SEND_DISTRESS_SIGNAL}
              component={SendDistreeSignal}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name={EScreen.SIGNUP_BY_PHONE_NUMBER}
              component={SignupByPhoneNumberScreen}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name={EScreen.SIGNIN_BY_EMAIL}
              component={SignInByEmailScreen}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name={EScreen.SIGNUP_BY_SOCIAL}
              component={SignupBySocialScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={EScreen.CONFIRM_PHONE_NUMBER}
              component={ConfirmPhoneNumberScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={EScreen.SIGNUP_INFO}
              component={SetupInfoScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={EScreen.CONFIRM_POLICY}
              component={ConfirmPolicyScreen}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
