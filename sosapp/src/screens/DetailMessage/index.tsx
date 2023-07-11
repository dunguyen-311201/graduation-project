import {
  ActiveIcon,
  CustomButton,
  DropDown,
  DropDown2,
  EmptyListComponent,
  ExpiredIcon,
  InProgressIcon,
  PendingIcon,
  ScreenBase,
  Textreae,
  UserInfo,
} from '@components';
import {Alert, StyleSheet, View} from 'react-native';
import {EMessage, ERole, EScreen} from '@enums';
import {MESSAGE_IN_PROGRESS, MESSAGE_PENDING, types} from '@constants';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useMessage, useUsers, useWorker} from '@hooks';

import {Context} from '@context';
import {RootParamList} from '@navigation/RootNavigation';
import {RootScreenNavigationProps} from '@navigation';

type ConfirmRoute = RouteProp<RootParamList, EScreen.DETAIL_MESSAGE>;

const DetailMessage = () => {
  const {navigate, setOptions} =
    useNavigation<RootScreenNavigationProps<EScreen.DETAIL_MESSAGE>>();

  const {id, onReject, onDelete} = useRoute<ConfirmRoute>().params || {};

  const {currentUser} = useContext(Context);

  const {message, onComfirm, onComplete, onAssign, loading} = useMessage(id);

  const [workerID, setWorkerID] = useState<string>();

  const {workers} = useWorker(true);

  const {user} = useUsers(message?.workerID);

  const workerDropdown = useMemo(
    () =>
      workers.map(worker => ({
        id: worker.id,
        value: worker.displayName,
      })),
    [workers],
  );

  useEffect(() => {
    if (message?.status) {
      let Icon: any;
      if (message.status === EMessage.MESSAGE_PENDING) {
        Icon = <PendingIcon />;
      } else if (message.status === EMessage.MESSAGE_IN_PROGRESS) {
        Icon = <InProgressIcon />;
      } else if (message.status === EMessage.MESSAGE_COMPLETED) {
        Icon = <ActiveIcon />;
      } else {
        Icon = <ExpiredIcon />;
      }
      setOptions({
        headerRight: () => Icon,
        headerRightContainerStyle: styles.headerRight,
      });
    }
  }, [message?.status]);

  const handleMap = useCallback(() => {
    if (message?.location) {
      if (currentUser?.role === ERole.USER && user?.location) {
        navigate(EScreen.MAP, {to: user.location});

        return;
      }
      navigate(EScreen.MAP, {to: message?.location});
    }
  }, [message?.location, user?.location]);

  const handleDelete = useCallback(async () => {
    message && onDelete && (await onDelete(message.id));
    navigate(EScreen.MESSAGES);
  }, [message]);

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

  return (
    <ScreenBase
      padding={20}
      loading={loading}
      {...(isDelete && {
        ...(currentUser?.role === ERole.CENTER
          ? {
              onNext: handleAssign,
              nextTitle: 'Assign',
              disableNext: !workerID,
            }
          : currentUser?.role === ERole.USER
          ? {
              onNext: handleDelete,
              nextTitle: 'Remove',
              disableNext: !isDelete,
            }
          : {}),
      })}>
      {message && currentUser ? (
        <View style={styles.content}>
          <View>
            <View style={styles.row}>
              <UserInfo
                id={message.userID}
                onLongPress={() => {}}
                customStyle={styles.item}
              />

              <UserInfo id={message.workerID} customStyle={styles.item} />
            </View>
          </View>

          <DropDown
            data={types}
            initValue={message.type}
            onSelect={() => {}}
            field="type"
            title="Type"
            zIndex={1}
            disabled={true}
          />

          <Textreae
            title="Description"
            field="description"
            onChangeText={handleMap}
            value={message.description}
            editable={currentUser?.role !== 'user'}
          />

          <CustomButton
            type="secondary"
            onPress={handleMap}
            customStyle={styles.seeMapButton}
            label="See location on Map"
          />

          {currentUser.role === ERole.CENTER &&
            message.status === MESSAGE_PENDING && (
              <DropDown2
                data={workerDropdown}
                value={workerID}
                onSelect={handleSelect}
              />
            )}

          <View style={styles.options}>
            {currentUser.role === ERole.WORKER && (
              <>
                {message.status === MESSAGE_PENDING && (
                  <>
                    <CustomButton
                      onPress={onComfirm}
                      customStyle={styles.seeMapButton}
                      label="Comfirm"
                    />
                    {onReject && (
                      <CustomButton
                        onPress={handleReject}
                        customStyle={styles.seeMapButton}
                        label="Reject"
                      />
                    )}
                  </>
                )}
              </>
            )}

            {currentUser.role !== ERole.CENTER && (
              <>
                {message.status === MESSAGE_IN_PROGRESS && (
                  <CustomButton
                    onPress={onComplete}
                    customStyle={styles.seeMapButton}
                    label="Complete"
                  />
                )}
              </>
            )}
          </View>
        </View>
      ) : (
        <EmptyListComponent text="Not Found Request!" />
      )}
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
    columnGap: 10,
  },
  seeMapButton: {
    marginTop: 10,
  },
  options: {
    marginTop: 10,
  },
  item: {
    backgroundColor: 'yellow',
    flex: 1,
  },
  headerRight: {
    paddingRight: 20,
  },
});
