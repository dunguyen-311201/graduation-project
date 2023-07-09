import {
  StyleSheet,
  View,
  Modal,
  Alert,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useMemo, useState} from 'react';

import {EScreen} from '@enums';
import {
  CloseBlackIcon,
  DARK_GRAY_COLOR,
  NewIcon,
  OpenIcon,
  OptionIcon,
  UnlockIcon,
  WHITE_COLOR,
} from '@theme';
import {TUser} from '@types';
import {useWorker} from '@hooks';
import {WorkerItem} from './components';
import {CustomButton, CustomText, ScreenBase} from '@components';
import {RootScreenNavigationProps} from '@navigation';
import {
  formatDistance,
  formatTime,
  formatTimeAgo,
  isApprovedCenter,
} from '@utils';

const Worker = () => {
  const {navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.WORKER>>();

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
        await deleteWorker(id);
        setId(undefined);
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
      title="Management Workers"
      loading={loading}
      padding={10}
      onBack={goBack}
      flexHeader="row">
      <View style={styles.container}>
        <FlatList
          data={workers}
          renderItem={handleRenderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={itemSeparatorComponent}
        />
        <CustomButton
          icon={NewIcon}
          type="secondary"
          customStyle={styles.btnAdd}
          onPress={handleAddWorker}
        />
      </View>
      <Modal visible={id !== undefined} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={handleHiden}>
          <View style={styles.container}>
            <View style={styles.modalContent}>
              <View style={styles.info}>
                {workerSelect?.startAt && (
                  <View style={styles.row}>
                    <CustomText
                      text="In progress:"
                      color="black"
                      type="text_medium_18"
                    />
                    <CustomText
                      text={formatTimeAgo(workerSelect?.startAt)}
                      color="black"
                      type="text_medium_18"
                    />
                  </View>
                )}

                {workerSelect?.time && workerSelect?.distance !== undefined && (
                  <View style={styles.row}>
                    <CustomText
                      text={formatDistance(workerSelect.distance)}
                      color="black"
                      type="text_medium_18"
                    />
                    <CustomText text="/" color="black" type="text_medium_18" />
                    <CustomText
                      text={formatTime(workerSelect.time)}
                      color="black"
                      type="text_medium_18"
                    />
                  </View>
                )}

                <View style={styles.row}>
                  <CustomText
                    text={workerSelect?.email || ''}
                    color="black"
                    type="text_medium_18"
                  />
                </View>
              </View>
              {workerSelect?.disabled && (
                <CustomButton
                  icon={UnlockIcon}
                  label="Active this Worker"
                  type="secondary"
                  onPress={handleActive}
                  reverse
                />
              )}

              <CustomButton
                icon={CloseBlackIcon}
                label="Remove this Worker"
                type="secondary"
                onPress={handleDelete}
                reverse
              />
              <CustomButton
                label="View all tasks"
                type="secondary"
                icon={OpenIcon}
                onPress={handleToRequestByWorker}
                reverse
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScreenBase>
  );
};

export default Worker;

const styles = StyleSheet.create({
  btnAdd: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  container: {
    marginTop: 20,
    flex: 1,
  },
  input: {
    color: DARK_GRAY_COLOR,
  },
  separator: {
    height: 5,
  },
  modalContent: {
    backgroundColor: WHITE_COLOR,
    borderRadius: 8,
    // height: 150,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    rowGap: 10,
  },
  info: {
    alignItems: 'center',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    columnGap: 10,
  },
});
