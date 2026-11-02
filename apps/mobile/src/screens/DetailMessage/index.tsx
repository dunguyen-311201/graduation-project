import {
  AppButton,
  ScreenHeader,
  EmptyListComponent,
  Loading,
  StatusPill,
  Avatar,
  StatusStepper,
  Txt,
  UserInfo,
} from '@components';
import {Alert, Pressable, ScrollView, StyleSheet, View} from 'react-native';
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
import {themedStyles} from '../../theme/tokens';

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
    // Only an open request can be cancelled; closed ones show no action.
    () => message?.status === MESSAGE_PENDING,
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
      <ScreenHeader title="Request" onBack={goBack} />
      {message && currentUser ? (
        <>
          <ScrollView contentContainerStyle={styles.body}>
            <View style={styles.card}>
              <StatusPill status={message.status} stage={message.stage} />
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
              <UserInfo id={message.userID} label="Requester" />
              <View style={styles.divider} />
              {message.workerID ? (
                <UserInfo id={message.workerID} label="Rescue worker" />
              ) : (
                <Txt variant="body" color={colors.textMuted}>
                  No worker assigned yet
                </Txt>
              )}
            </View>

            {role === ERole.CENTER && message.status === MESSAGE_PENDING && (
              <View style={styles.card} accessibilityRole="radiogroup">
                <Txt variant="label" color={colors.textMuted}>
                  Choose a worker
                </Txt>
                {workerDropdown.length === 0 ? (
                  <Txt variant="body" color={colors.textMuted}>
                    No worker is free right now.
                  </Txt>
                ) : (
                  workerDropdown.map(w => {
                    const selected = w.id === workerID;
                    return (
                      <Pressable
                        key={w.id}
                        onPress={() => handleSelect(w.id)}
                        accessibilityRole="radio"
                        accessibilityState={{selected}}
                        accessibilityLabel={w.value}
                        style={[styles.option, selected && styles.optionOn]}>
                        <Avatar name={w.value} size={36} />
                        <Txt variant="body" style={styles.flex}>
                          {w.value || 'Worker'}
                        </Txt>
                        <View style={[styles.radio, selected && styles.radioOn]} />
                      </Pressable>
                    );
                  })
                )}
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

const styles = themedStyles(() => StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  header: {paddingHorizontal: space.xl, paddingTop: space.lg, rowGap: space.md},
  body: {paddingHorizontal: space.xl, paddingTop: space.sm, paddingBottom: space.xl, rowGap: space.md},
  card: {
    padding: space.lg,
    rowGap: space.sm,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  divider: {height: StyleSheet.hairlineWidth, backgroundColor: colors.border},
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: space.md,
    minHeight: 56,
    paddingHorizontal: space.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionOn: {borderColor: colors.primary, backgroundColor: colors.primarySoft},
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textMuted,
  },
  radioOn: {borderColor: colors.primary, borderWidth: 6},
  flex: {flex: 1},
  footer: {
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    paddingBottom: space.xl,
    rowGap: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
}));
