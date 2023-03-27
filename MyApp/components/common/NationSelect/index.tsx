import {Dimensions, FlatList, StyleSheet} from 'react-native';
import React, {useCallback} from 'react';

import {NationProps} from '../../../types';
import NationOption from './components/NationOption';
import {BLACK_COLOR} from '../../../themes';

import {PHONES} from '../../../constants';

const NationSelect = ({
  onChangeNation,
}: {
  onChangeNation: (code: string) => void;
}) => {
  const _renderItem = useCallback(
    ({item}: {item: NationProps}) => (
      <NationOption nation={item} isDetails onPress={onChangeNation} />
    ),
    [onChangeNation],
  );

  const _keyExtractor = useCallback(
    (item: NationProps, index: number) => index + '',
    [],
  );

  return (
    <FlatList
      style={styles.container}
      data={PHONES}
      renderItem={_renderItem}
      keyExtractor={_keyExtractor}
    />
  );
};

export default NationSelect;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: BLACK_COLOR,
    maxHeight: Dimensions.get('window').height / 2,
  },
});
