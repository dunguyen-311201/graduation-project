import {tokens} from '@theme';
import {
  AppButton,
  EmptyListComponent,
  Txt,
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
import {rejectAssign} from '@features/rescue';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useNotifications} from '@features/notification';

const {colors, space, radius} = tokens;

const Notification = () => {
  const {notifications, loading, onDelete} = useNotifications();
  const [notification, setNotification] = useState<TNotification>();

  const {navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.MESSAGES>>();
  const inTab = useRoute().name !== EScreen.NOTIFICATION;

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
      ...(tID && {onReject: async () => await rejectAssign(tID)}),
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
      onBack={inTab ? undefined : goBack}
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
          <EmptyListComponent
            text="No notifications yet"
            hint="Updates about your requests will show up here."
          />
        )}
      </View>
      <Modal
        visible={notification !== undefined}
        transparent
        animationType="slide"
        onRequestClose={handleHiden}>
        <TouchableWithoutFeedback onPress={handleHiden}>
          <View style={styles.scrim}>
            <TouchableWithoutFeedback>
              <View style={styles.sheet}>
                <View style={styles.handle} />
                <Txt variant="heading">{notification?.title}</Txt>
                <Txt variant="body" color={colors.textMuted}>
                  {notification?.body}
                </Txt>
                <AppButton label="Open request" onPress={handleAction} />
                <AppButton
                  label="Remove notification"
                  variant="ghost"
                  onPress={handleDelete}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScreenBase>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {flex: 1, marginTop: 20},
  separator: {height: space.md},
  scrim: {flex: 1, justifyContent: 'flex-end', backgroundColor: colors.scrim},
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    padding: space.xl,
    paddingTop: space.sm,
    rowGap: space.md,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: space.sm,
  },
});
