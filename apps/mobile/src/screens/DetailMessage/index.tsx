import {
  AppButton,
  BackButton,
  DropDown2,
  EmptyListComponent,
  Loading,
  StatusPill,
  StatusStepper,
  Txt,
  UserInfo,
} from '@components';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {ERole, EScreen} from '@enums';
import {
  MESSAGE_COMPLETED,
  MESSAGE_IN_PROGRESS,
  MESSAGE_PENDING,
} from '@constants';
import React, {useCallback, useContext, useMemo, useState} from 'react';
import {tokens} from '@theme';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useUsers} from '@features/auth';
import {useMessage, useWorker} from '@features/rescue';

import {Context} from '@context';
import {RootParamList} from '@navigation/RootNavigation';
import {RootScreenNavigationProps} from '@navigation';

const {colors, space, radius} = tokens;

type ConfirmRoute = RouteProp<RootParamList, EScreen.DETAIL_MESSAGE>;

const DetailMessage = () => {
  const {navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.DETAIL_MESSAGE>>();

  const {id, onReject, onDelete} = useRoute<ConfirmRoute>().params || {};

  const {currentUser} = useContext(Context);

  const {
    message,
    onComfirm,
    onComplete,
    onAssign,
    onDelete: onDeleteMessage,
    loading,
  } = useMessage(id);

  const [workerID, setWorkerID] = useState<string>();

  const {workers} = useWorker(true);

  const {user} = useUsers(message?.workerID);

  const workerDropdown = useMemo(
    () =>
      workers.map(worker => ({
        id: worker.id,
        value: worker.displayName ?? '',
      })),
    [workers],
  );

  const handleMap = useCallback(() => {
    if (message?.location) {
      if (currentUser?.role === ERole.USER && user?.location) {
        navigate(EScreen.MAP, {to: user.location});

        return;
      }
      navigate(EScreen.MAP, {to: message?.location});
    }
  }, [message?.location, user?.location]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Remove this request?',
      'Rescue teams will no longer see it.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            if (message) {
              await (onDelete ? onDelete(message.id) : onDeleteMessage());
            }
            navigate(EScreen.MESSAGES);
          },
        },
      ],
    );
  }, [message, onDelete, onDeleteMessage]);

  const handleSelect = useCallback((_workerID: string) => {
    setWorkerID(_workerID);
  }, []);

  const handleReject = useCallback(async () => {
    onReject && (await onReject());
    navigate(EScreen.DRAWER);
  }, [onReject]);

  const handleAssign = useCallback(async () => {
    if (workerID) {
      await onAssign(workerID);
      navigate(EScreen.DRAWER);
    } else {
      Alert.alert('Select Worker', 'Please select a worker to assign!', [
        {
          onPress: () => {},
          text: 'OK',
        },
      ]);
    }
  }, [workerID]);

  const isDelete = useMemo(
    () => message?.status === MESSAGE_PENDING || message?.status === 'expired',
    [message],
  );

  const role = currentUser?.role;
  const footer: React.ReactNode[] = [];
  if (message && role === ERole.CENTER && message.status === MESSAGE_PENDING) {
    footer.push(
      <AppButton key="assign" label="Assign worker" disabled={!workerID} onPress={handleAssign} />,
    );
  }
  if (message && role === ERole.WORKER && message.status === MESSAGE_PENDING) {
    footer.push(<AppButton key="confirm" label="Accept task" onPress={onComfirm} />);
    onReject &&
      footer.push(
        <AppButton key="reject" label="Reject" variant="secondary" onPress={handleReject} />,
      );
  }
  if (message && role !== ERole.CENTER && message.status === MESSAGE_IN_PROGRESS) {
    footer.push(<AppButton key="complete" label="Mark as completed" onPress={onComplete} />);
  }
  if (message && role === ERole.USER && message.status === MESSAGE_COMPLETED) {
    footer.push(
      <AppButton
        key="rate"
        label="Rate this rescue"
        onPress={() => navigate(EScreen.RESCUE_COMPLETED, {id: message.id})}
      />,
    );
  }
  if (message && role === ERole.USER && isDelete) {
    footer.push(
      <AppButton key="remove" label="Cancel request" variant="ghost" onPress={handleDelete} />,
    );
  }

  return (
    <View style={styles.container}>
      {loading && <Loading />}
      <View style={styles.header}>
        <BackButton onPress={goBack} />
        <Txt variant="title">Request</Txt>
      </View>
      {message && currentUser ? (
        <>
          <ScrollView contentContainerStyle={styles.body}>
            <View style={styles.card}>
              <StatusPill status={message.status} />
              <Txt variant="heading">{message.type}</Txt>
              <Txt variant="caption" color={colors.textMuted}>
                {new Date(message.time).toLocaleString()}
              </Txt>
              {message.description ? (
                <Txt variant="body">{message.description}</Txt>
              ) : null}
            </View>

            <View style={styles.card}>
              <Txt variant="label" color={colors.textMuted}>
                Progress
              </Txt>
              <StatusStepper stage={message.stage} />
            </View>

            <View style={styles.card}>
              <Txt variant="label" color={colors.textMuted}>
                Location
              </Txt>
              <Txt variant="body">
                {message.location?.description || 'GPS position'}
              </Txt>
              <AppButton label="Open in map" variant="secondary" onPress={handleMap} />
            </View>

            <View style={styles.card}>
              <Txt variant="label" color={colors.textMuted}>
                People
              </Txt>
              <View style={styles.people}>
                <UserInfo id={message.userID} customStyle={styles.flex} />
                {message.workerID ? (
                  <UserInfo id={message.workerID} customStyle={styles.flex} />
                ) : (
                  <Txt variant="body" color={colors.textMuted} style={styles.flex}>
                    No worker yet
                  </Txt>
                )}
              </View>
            </View>

            {role === ERole.CENTER && message.status === MESSAGE_PENDING && (
              <View style={[styles.card, styles.raised]}>
                <Txt variant="label" color={colors.textMuted}>
                  Choose a worker
                </Txt>
                <DropDown2
                  data={workerDropdown}
                  value={workerID}
                  onSelect={handleSelect}
                />
              </View>
            )}
          </ScrollView>
          {footer.length > 0 && <View style={styles.footer}>{footer}</View>}
        </>
      ) : (
        <EmptyListComponent text="Request not found" />
      )}
    </View>
  );
};

export default DetailMessage;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  header: {paddingHorizontal: space.xl, paddingTop: space.lg, rowGap: space.md},
  body: {padding: space.xl, rowGap: space.lg},
  card: {
    padding: space.lg,
    rowGap: space.sm,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  raised: {zIndex: 2},
  people: {flexDirection: 'row', columnGap: space.md},
  flex: {flex: 1},
  footer: {
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    paddingBottom: space.xl,
    rowGap: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
