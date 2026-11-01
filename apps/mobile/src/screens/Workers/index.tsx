import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  AppButton,
  EmptyListComponent,
  ScreenBase,
  Txt,
} from '@components';
import {OptionIcon, tokens} from '@theme';
import React, {useCallback, useMemo, useState} from 'react';
import {
  formatDistance,
  formatTime,
  formatTimeAgo,
} from '@utils';

import {EScreen} from '@enums';
import {RootScreenNavigationProps} from '@navigation';
import {TUser} from '@types';
import {WorkerItem} from './components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {isApprovedCenter} from '@features/auth';
import {useWorker} from '@features/rescue';
import {themedStyles} from '../../theme/tokens';

const {colors, space, radius} = tokens;

const Worker = () => {
  const {navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.WORKER>>();
  const inTab = useRoute().name !== EScreen.WORKER;

  const [id, setId] = useState<string>();

  const {workers, deleteWorker, activeWorker, loading} = useWorker();

  const workerSelect = useMemo(
    () => workers.find(item => item.id === id),
    [id, workers],
  );

  const handleAddWorker = useCallback(async () => {
    if (await isApprovedCenter()) {
      Alert.alert(
        'Unable to create a Worker',
        'Your center has not yet approved.',
        [
          {
            text: 'OK',
            onPress: () => {},
          },
        ],
      );
      return;
    }
    navigate(EScreen.NEW_WORKER);
  }, []);

  const handleDelete = useCallback(async () => {
    if (workerSelect && id) {
      const {displayName, status} = workerSelect;
      if (status !== 'busy') {
        Alert.alert('Remove this worker?', `${displayName ?? 'This worker'} will no longer get tasks.`, [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              await deleteWorker(id);
              setId(undefined);
            },
          },
        ]);
        return;
      }

      Alert.alert(
        'Unable to Delete Worker',
        displayName + ' is currently doing the rescue.',
        [
          {
            text: 'OK',
            onPress: () => {},
          },
        ],
      );
    }
  }, [workerSelect]);

  const handleSelect = useCallback((_id: string) => {
    setId(_id);
  }, []);

  const handleHiden = useCallback(() => {
    setId(undefined);
  }, []);

  const handleRenderItem = useCallback(
    ({item}: {item: TUser}) => (
      <WorkerItem user={item} icon={OptionIcon} callback={handleSelect} />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: TUser, index: number) => index + '',
    [],
  );

  const itemSeparatorComponent = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const handleToRequestByWorker = useCallback(() => {
    id && navigate(EScreen.ASSIGN, {id});
  }, [id]);

  const handleActive = useCallback(async () => {
    id && (await activeWorker(id));
  }, [id]);

  return (
    <ScreenBase
      title="Workers"
      loading={loading}
      padding={20}
      onBack={inTab ? undefined : goBack}
      flexDirection="row">
      <View style={styles.container}>
        <FlatList
          data={workers}
          renderItem={handleRenderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={itemSeparatorComponent}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyListComponent
              text="No workers yet"
              hint="Add your first rescue worker to start assigning requests."
            />
          }
        />
        <AppButton label="Add worker" onPress={handleAddWorker} />
      </View>
      <Modal
        visible={id !== undefined}
        transparent
        animationType="slide"
        onRequestClose={handleHiden}>
        <TouchableWithoutFeedback onPress={handleHiden}>
          <View style={styles.scrim}>
            <TouchableWithoutFeedback>
              <View style={styles.sheet}>
                <View style={styles.handle} />
                <Txt variant="heading" style={styles.name}>
                  {workerSelect?.displayName || 'Worker'}
                </Txt>
                {workerSelect?.email ? (
                  <Txt variant="caption" color={colors.textMuted}>
                    {workerSelect.email}
                  </Txt>
                ) : null}
                {workerSelect?.startAt ? (
                  <Txt variant="body">
                    On a rescue since {formatTimeAgo(workerSelect.startAt)}
                  </Txt>
                ) : null}
                {workerSelect?.time && workerSelect?.distance !== undefined ? (
                  <Txt variant="body" color={colors.textMuted}>
                    {formatDistance(workerSelect.distance)} ·{' '}
                    {formatTime(workerSelect.time)} away
                  </Txt>
                ) : null}
                <AppButton label="View tasks" onPress={handleToRequestByWorker} />
                {workerSelect?.disabled && (
                  <AppButton
                    label="Activate worker"
                    variant="secondary"
                    onPress={handleActive}
                  />
                )}
                <AppButton
                  label="Remove worker"
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

export default Worker;

const styles = themedStyles(() => StyleSheet.create({
  container: {marginTop: 20, flex: 1, rowGap: space.md},
  list: {flexGrow: 1},
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
  name: {textTransform: 'capitalize'},
}));
