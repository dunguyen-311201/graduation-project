import {StyleSheet, View} from 'react-native';
import React, {useMemo, useCallback, memo} from 'react';
import {useNavigation} from '@react-navigation/native';

import {
  ActiveIcon,
  ExpiredIcon,
  InProgressIcon,
  PendingIcon,
} from '@components';
import {GRAY_COLOR, ArrowRightBlueIcon} from '@theme';
import {TTask} from '@types';
import {EMessage, EScreen} from '@enums';
import {CustomButton, CustomText} from '@components';
import {RootScreenNavigationProps} from '@navigation/index';

const TaskItem = ({task}: {task: TTask}) => {
  const {navigate} = useNavigation<RootScreenNavigationProps<EScreen.ASSIGN>>();

  const icon = useMemo(() => {
    if (task.status === EMessage.MESSAGE_PENDING) {
      return <PendingIcon />;
    } else if (task.status === EMessage.MESSAGE_IN_PROGRESS) {
      return <InProgressIcon />;
    } else if (task.status === EMessage.MESSAGE_COMPLETED) {
      return <ActiveIcon />;
    } else {
      return <ExpiredIcon />;
    }
  }, [task]);

  const handleDetail = useCallback(() => {
    navigate(EScreen.DETAIL_MESSAGE, {id: task.messID});
  }, [task]);

  return (
    <View style={styles.container}>
      <CustomText
        text={new Date(task.time).toLocaleString()}
        type="text_regular_20"
        color="blue"
      />
      {icon}
      <CustomButton
        icon={ArrowRightBlueIcon}
        type="secondary"
        onPress={handleDetail}
      />
    </View>
  );
};

export default memo(TaskItem);

const styles = StyleSheet.create({
  container: {
    backgroundColor: GRAY_COLOR,
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
