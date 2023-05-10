import {StyleSheet, View, Platform} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';

import {EScreen} from '@enums';
import {RootParamList} from '@navigation/RootNavigation';
import {useMessage} from '@hooks';
import {
  CustomInput,
  CustomText,
  DropDown,
  ScreenBase,
  Textreae,
} from '@components';
import {RootScreenNavigationProps} from '@navigation';
import {TMessage, TUser} from '@types';
import {getUserByID} from '@utils';

type ConfirmRoute = RouteProp<RootParamList, EScreen.DETAIL_MESSAGE>;

const status = ['Pending', 'In Progress', 'Complete'];
const types = ['Traffic accident', 'Vehicle breakdown'];

const DetailMessage = () => {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.DETAIL_MESSAGE>>();

  const {uid} = useRoute<ConfirmRoute>().params || {
    uid: 'c00428c1-bd5a-4f51-b5f4-04ef0a85ae48',
  };

  const {message} = useMessage(uid);

  const [messageData, setMessageData] = useState<TMessage>();
  const [userData, setUserData] = useState<TUser>();

  useEffect(() => {
    setOptions({title: 'Detail Message'});

    setMessageData(message);

    const getUserData = async () => {
      if (message) {
        const user = await getUserByID(message.userId);
        if (user) {
          setUserData({
            ...user,
            name: `${user.firstName} ${user.lastName}`,
          });
        }
      }
    };

    getUserData();
  }, [message, setOptions]);

  const handleChangeMessage = useCallback((value: string, field: string) => {
    setMessageData(prev => ({...prev, [field]: value}));
  }, []);

  const handleChangeUser = useCallback((value: string, field: string) => {
    setUserData(prev => ({...prev, [field]: value}));
  }, []);

  const handleOpenMap = useCallback(() => {
    if (messageData) {
      navigate(EScreen.MAP, {initLocation: messageData?.location});
    }
  }, [messageData, navigate]);

  const handleNext = useCallback(async () => {
    navigate(EScreen.DRAWER);
  }, [navigate]);

  return (
    <ScreenBase onNext={handleNext}>
      {messageData && userData && (
        <View style={styles.formMessage}>
          <DropDown
            data={status}
            field="status"
            title="Status"
            onSelect={handleChangeMessage}
            initValue={messageData.status || 'spending'}
            zIndex={2}
          />
          <DropDown
            data={types}
            field="type"
            title="Type"
            onSelect={handleChangeMessage}
            initValue={messageData.type}
            zIndex={1}
          />
          <CustomInput
            value={userData.name}
            title="Name"
            field="name"
            onChangeText={handleChangeUser}
          />
          <CustomInput
            value={userData.phoneNumber}
            title="Phone"
            field="phoneNumber"
            onChangeText={handleChangeUser}
          />
          <CustomInput
            field="location"
            value={messageData.location?.description}
            title="Location"
          />
          <CustomText
            text="See location on Map"
            type="text_medium_14"
            color="blue"
            onPress={handleOpenMap}
          />
          <Textreae
            title="Description"
            field="description"
            onChangeText={handleChangeMessage}
            value={messageData.description}
          />
        </View>
      )}
    </ScreenBase>
  );
};

export default DetailMessage;

const styles = StyleSheet.create({
  formMessage: {
    flex: 1,
    marginTop: 20,
  },
});
