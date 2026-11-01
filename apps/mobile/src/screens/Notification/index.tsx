import {tokens} from '@theme';
import {
  AppButton,
  EmptyListComponent,
  Txt,
  ScreenBase,
} from '@components';
import {
  Modal,
  SectionList,
  SectionListRenderItemInfo,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import NotificationRow, {kindOf} from './components/NotificationRow';

import {EScreen} from '@enums';
import {RootScreenNavigationProps} from '@navigation';
import {TNotification} from '@types';
import {rejectAssign} from '@features/rescue';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useNotifications} from '@features/notification';
import {themedStyles} from '../../theme/tokens';

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

  // Today first, then everything older, newest on top.
  const sections = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const sorted = [...(notifications ?? [])].sort((a, b) => b.time - a.time);
    return [
      {title: 'Today', data: sorted.filter(n => n.time >= start.getTime())},
      {title: 'Earlier', data: sorted.filter(n => n.time < start.getTime())},
    ].filter(sec => sec.data.length > 0);
  }, [notifications]);

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
    ({item, index, section}: SectionListRenderItemInfo<TNotification, {title: string; data: TNotification[]}>) => (
      <NotificationRow
        item={item}
        onPress={handleshow}
        first={index === 0}
        last={index === section.data.length - 1}
      />
    ),
    [handleshow],
  );

  const renderSectionHeader = useCallback(
    ({section}: {section: {title: string}}) => (
      <Txt variant="label" color={colors.textMuted} style={styles.sectionTitle}>
        {section.title}
      </Txt>
    ),
    [],
  );

  return (
    <ScreenBase
      title="Alerts"
      padding={24}
      loading={loading}
      onBack={inTab ? undefined : goBack}
      flexDirection="row">
      <View style={styles.container}>
        {notifications && notifications.length > 0 ? (
          <SectionList
            sections={sections}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={keyExtractor}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
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
                <Txt variant="heading">
                  {notification ? kindOf(notification.title).title : ''}
                </Txt>
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

const styles = themedStyles(() => StyleSheet.create({
  container: {flex: 1},
  list: {paddingBottom: space.xl},
  sectionTitle: {marginTop: space.lg, marginBottom: space.sm},
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
}));
