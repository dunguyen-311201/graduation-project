import {CloseBlackIcon, OpenIcon, WHITE_COLOR} from '@theme';
import {
  CustomButton,
  EmptyListComponent,
  NotifyCard,
  ScreenBase,
} from '@components';
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';

import {EScreen} from '@enums';
import {RootScreenNavigationProps} from '@navigation';
import {TNotification} from '@types';
import {rejectAssign} from '@utils';
import {useNavigation} from '@react-navigation/native';
import {useNotifications} from '@hooks';

const Notification = () => {
  const {notifications, loading, onDelete} = useNotifications();
  const [notification, setNotification] = useState<TNotification>();

  const {navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.MESSAGES>>();

  const handleshow = useCallback((no?: TNotification) => {
    no && setNotification(no);
  }, []);

  const handleHiden = useCallback(() => {
    setNotification(undefined);
  }, []);

  const keyExtractor = useCallback((item: TNotification) => item.id + '', []);

  const handleAction = useCallback(() => {
    const {tID, id} = notification?.data || {};
    const params = {
      id,
      ...(tID && {onRject: async () => await rejectAssign(tID)}),
    };
    navigate(EScreen.DETAIL_MESSAGE, params);
    setNotification(undefined);
  }, [notification]);

  const handleDelete = useCallback(async () => {
    if (notification) {
      setNotification(undefined);
      await onDelete(notification.id);
    }
  }, [notification]);

  const renderItem = useCallback(
    ({item}: {item: TNotification}) => (
      <NotifyCard notify={item} onPress={handleshow} />
    ),
    [],
  );

  const ItemSeparatorComponent = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  return (
    <ScreenBase
      title="Notifications"
      padding={20}
      loading={loading}
      onBack={goBack}
      flexDirection="row">
      <View style={styles.container}>
        {notifications && notifications.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={ItemSeparatorComponent}
          />
        ) : (
          <EmptyListComponent />
        )}
      </View>
      <Modal
        visible={notification !== undefined}
        transparent
        animationType="slide">
        <TouchableWithoutFeedback onPress={handleHiden}>
          <View style={styles.container}>
            <View style={styles.modalContent}>
              <CustomButton
                icon={CloseBlackIcon}
                label="Remove this notification"
                type="secondary"
                onPress={handleDelete}
                reverse
              />
              <CustomButton
                label="View action this notification"
                type="secondary"
                icon={OpenIcon}
                onPress={handleAction}
                reverse
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScreenBase>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  separator: {
    height: 2,
  },
  modalContent: {
    backgroundColor: WHITE_COLOR,
    borderRadius: 8,
    height: 150,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
});
