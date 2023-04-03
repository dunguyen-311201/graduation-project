import {FlatList, Image, Pressable, StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {CustomInput} from '@components/common';
import {PHONES} from '../../../constants';
import {Nation} from '@types';
import {WHITE_COLOR} from '@theme/color';
import {DropDownIcon} from '@theme/icon';
import NationSelect from './NationSelect';

type INation = Nation & {phone?: string};
const PhoneInput = () => {
  const [isVisible, setIsvisible] = useState(false);

  const [nation, setNation] = useState<INation>({
    ...PHONES[0],
  });

  const _onChangeText = useCallback((value: string, field: string) => {
    setNation(_nation => {
      return {..._nation, [field]: value};
    });
  }, []);

  const handleSelectNation = useCallback((_nation: Nation) => {
    setNation(_nation);
    setIsvisible(false);
  }, []);

  const _renderItem = useCallback(
    ({item}: {item: Nation}) => (
      <NationSelect nation={item} onSelect={handleSelectNation} />
    ),
    [handleSelectNation],
  );

  const _keyExtractor = useCallback(({code}: Nation) => code, []);

  const handleVisibleSelect = useCallback(
    () => setIsvisible(prev => !prev),
    [],
  );

  return (
    <View style={styles.phoneinput}>
      {isVisible && (
        <FlatList
          style={styles.nationList}
          data={PHONES}
          renderItem={_renderItem}
          keyExtractor={_keyExtractor}
        />
      )}
      <Pressable style={styles.flagSelect} onPress={handleVisibleSelect}>
        <Image source={{uri: nation?.url}} style={styles.flag} />
        <Image source={DropDownIcon} style={styles.dropDown} />
      </Pressable>
      <CustomInput
        value={nation?.phone || ''}
        onChangeText={_onChangeText}
        field="phone"
        inputMode="numeric"
        valueStyle={styles.phone}
        title={nation?.code}
        titleStyle={styles.phoneTitle}
      />
    </View>
  );
};

export default PhoneInput;

const styles = StyleSheet.create({
  phoneinput: {
    width: '100%',
    position: 'relative',
    flexDirection: 'row',
    zIndex: 1,
    marginTop: 20,
  },
  phoneTitle: {},
  phone: {
    color: '#979797',
    fontWeight: '500',
    fontSize: 24,
  },
  nationList: {
    backgroundColor: WHITE_COLOR,
    borderRadius: 10,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  flagSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  flag: {
    width: 52,
    height: 31,
  },
  dropDown: {
    marginLeft: 5,
  },
});
