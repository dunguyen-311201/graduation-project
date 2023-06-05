import {StyleSheet, View} from 'react-native';
import React, {useCallback, useContext, useEffect} from 'react';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';

import {
  CustomButton,
  CustomText,
  DropDown,
  ScreenBase,
  Textreae,
  UserInfo,
} from '@components';
import {EScreen} from '@enums';
import {useMessage, useUser} from '@hooks';
import {RootScreenNavigationProps} from '@navigation';
import {RootParamList} from '@navigation/RootNavigation';
import {Context} from '@context';

type ConfirmRoute = RouteProp<RootParamList, EScreen.DETAIL_MESSAGE>;

const status = ['Pending', 'In Progress', 'Complete'];
const types = ['Traffic accident', 'Vehicle breakdown'];

const DetailMessage = () => {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.DETAIL_MESSAGE>>();

  const {uid} = useRoute<ConfirmRoute>().params || {};

  const {currentUser} = useContext(Context);

  const {message} = useMessage(uid);
  const user = useUser(message?.userId);

  const service = useUser(message?.serviceId);

  useEffect(() => {
    setOptions({title: 'Detail Message'});
  }, [setOptions]);

  const handleSettingProfile = useCallback(() => {
    navigate(EScreen.SETTINGS);
  }, []);

  const handleMap = useCallback(() => {
    if (currentUser?.uid === message?.userId) {
      if (service?.user?.location) {
        navigate(EScreen.MAP, {
          to: service?.user?.location,
        });
        return;
      }
      navigate(EScreen.MAP);
      return;
    }
    navigate(EScreen.MAP, {
      to: message?.location,
    });
  }, [message, service?.user]);

  const handleNext = useCallback(() => {
    navigate(EScreen.HOME);
  }, []);

  return (
    <ScreenBase
      {...(currentUser?.uid === user.user?.uid && {onNext: handleNext})}>
      <View style={styles.content}>
        <View style={styles.row}>
          {user.user && (
            <UserInfo
              user={user.user}
              onLongPress={handleSettingProfile}
              disabled={currentUser?.uid !== user.user.uid}
            />
          )}
          {service.user && (
            <UserInfo
              user={service.user}
              marginLeft={10}
              disabled={currentUser?.uid !== service.user.uid}
            />
          )}
        </View>

        <DropDown
          data={status}
          field="status"
          title="Status"
          onSelect={() => {}}
          initValue={message?.status || 'spending'}
          zIndex={2}
        />
        <DropDown
          data={types}
          field="type"
          title="Type"
          onSelect={() => {}}
          initValue={message?.type}
          zIndex={1}
        />

        <Textreae
          title="Description"
          field="description"
          onChangeText={() => {}}
          value={message?.description}
        />

        <View style={styles.row}>
          <CustomButton
            type="secondary"
            onPress={handleMap}
            customStyle={styles.seeMapButton}>
            <CustomText
              text="See location on Map"
              type="text_medium_18"
              color="blue"
            />
          </CustomButton>
        </View>
      </View>
    </ScreenBase>
  );
};

export default DetailMessage;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  seeMapButton: {
    marginTop: 10,
  },
});
