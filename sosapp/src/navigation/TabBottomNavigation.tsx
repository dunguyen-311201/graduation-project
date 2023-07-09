// import {
//   ArhiveFillIcon,
//   ArhiveIcon,
//   BellFillIcon,
//   BellIcon,
//   TEXT_COLOR,
// } from '@theme';
// import {MessagesScreen, PendingMessageScreen} from '../screens';
// import React, {useContext} from 'react';

// import {Context} from '@context';
// import {EScreen} from '@enums';
// import {Image} from 'react-native';
// import {Notification} from '@components';
// import {RootScreenNavigationProps} from './index';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {requestLocationPermission} from '@utils';
// import {useNavigation} from '@react-navigation/native';

// export type BottomParamList = {
//   'pending-message-screen': undefined;
//   'done-messages-screen': undefined;
//   [EScreen.DETAIL_MESSAGE]: {id: string};
// };

// const Tab = createBottomTabNavigator<BottomParamList>();

// const TabBottomNavigation = () => {
//   const {navigate} =
//     useNavigation<RootScreenNavigationProps<EScreen.MESSAGES>>();

//   const {currentUser} = useContext(Context);

//   requestLocationPermission(currentUser?.role === 'worker' ? 0 : 1);

//   return (
//     <>
//       <Notification navigate={navigate} />
//       <Tab.Navigator
//         screenOptions={({route}) => ({
//           tabBarLabel: '',
//           tabBarStyle: {
//             height: 72,
//             backgroundColor: TEXT_COLOR,
//           },
//           headerShown: false,
//           // eslint-disable-next-line react/no-unstable-nested-components
//           tabBarIcon: ({focused}) => {
//             switch (route.name) {
//               case 'done-messages-screen':
//                 return <Image source={focused ? ArhiveFillIcon : ArhiveIcon} />;
//               case 'pending-message-screen':
//                 return <Image source={focused ? BellFillIcon : BellIcon} />;
//             }
//           },
//           unmountOnBlur: true,
//         })}>
//         {currentUser?.role === 'center' && (
//           <Tab.Screen
//             name="pending-message-screen"
//             component={PendingMessageScreen}
//           />
//         )}
//         <Tab.Screen name="done-messages-screen" component={MessagesScreen} />
//       </Tab.Navigator>
//     </>
//   );
// };

// export default TabBottomNavigation;
