import React, {useCallback} from 'react';
import {StyleSheet, FlatList, View} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {TTask} from '@types';
import {EScreen} from '@enums';
import {useTasks} from '@hooks';
import {TaskItem} from './components';
import {ScreenBase} from '@components';
import {RootScreenNavigationProps} from '@navigation';
import {RootParamList} from '@navigation/RootNavigation';

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
    <ScreenBase onBack={goBack}>
      <View style={styles.container}>
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={ItemSeparatorComponent}
        />
      </View>
    </ScreenBase>
  );
};

export default Assign;

const styles = StyleSheet.create({
  container: {flex: 1, overflow: 'scroll'},
  separator: {height: 4},
});
