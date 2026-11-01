import {Pressable, StyleSheet} from 'react-native';
import React, {memo, useCallback} from 'react';
import {StatusPill, Txt} from '@components';

import {EScreen} from '@enums';
import {RootScreenNavigationProps} from '@navigation/index';
import {TTask} from '@types';
import {tokens} from '@theme';
import {useNavigation} from '@react-navigation/native';
import {themedStyles} from '../../../theme/tokens';

const {colors, space, radius} = tokens;

const TaskItem = ({task}: {task: TTask}) => {
  const {navigate} = useNavigation<RootScreenNavigationProps<EScreen.ASSIGN>>();

  const handleDetail = useCallback(() => {
    navigate(EScreen.DETAIL_MESSAGE, {id: task.messID});
  }, [navigate, task.messID]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Opens the request"
      onPress={handleDetail}
      style={({pressed}) => [styles.card, pressed && styles.pressed]}>
      <StatusPill status={task.status} />
      <Txt variant="body">Assigned {new Date(task.time).toLocaleString()}</Txt>
    </Pressable>
  );
};

export default memo(TaskItem);

const styles = themedStyles(() => StyleSheet.create({
  card: {
    padding: space.lg,
    rowGap: space.sm,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  pressed: {backgroundColor: colors.surfaceRaised},
}));
