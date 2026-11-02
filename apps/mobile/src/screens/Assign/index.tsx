import React, {useCallback} from 'react';
import {StyleSheet, FlatList, View} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {TTask} from '@types';
import {EScreen} from '@enums';
import {useTasks} from '@features/rescue';
import {TaskItem} from './components';
import {EmptyListComponent, ScreenBase} from '@components';
import {RootScreenNavigationProps} from '@navigation';
import {RootParamList} from '@navigation/RootNavigation';
import {themedStyles} from '../../theme/tokens';

type ConfirmRoute = RouteProp<RootParamList, EScreen.ASSIGN>;

const Assign = () => {
  const {id} = useRoute<ConfirmRoute>().params || {};

  const {goBack} = useNavigation<RootScreenNavigationProps<EScreen.ASSIGN>>();

  const {tasks} = useTasks(id);

  const renderItem = useCallback(
    ({item}: {item: TTask}) => <TaskItem task={item} />,
    [],
  );

  const keyExtractor = useCallback((item: TTask) => item.id, []);

  const ItemSeparatorComponent = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  return (
    <ScreenBase onBack={goBack} title="Tasks" flexDirection="row" padding={20}>
      <View style={styles.container}>
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={ItemSeparatorComponent}
          ListEmptyComponent={
            <EmptyListComponent text="No tasks yet" hint="Requests assigned to this worker show up here." />
          }
        />
      </View>
    </ScreenBase>
  );
};

export default Assign;

const styles = themedStyles(() => StyleSheet.create({
  container: {flex: 1, marginTop: 20},
  separator: {height: 12},
}));
