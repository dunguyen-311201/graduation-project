import {FlatList, Image, Pressable, StyleSheet, View} from 'react-native';
import React, {memo, useCallback, useState} from 'react';
import {CustomInput} from '@components/common';
import {PHONES} from '../../../constants';
import {Nation} from '@types';
import {WHITE_COLOR} from '@theme/color';
import {DropDownIcon} from '@theme/icon';
import NationSelect from './NationSelect';

import {Styles as st} from '@utils';

export type INation = Nation & {phone: string};

type PhoneInputProps = {
  data: INation;
  onChangePhone: (nation: INation) => void;
};

const PhoneInput = ({data, onChangePhone}: PhoneInputProps) => {
  const [isVisible, setIsvisible] = useState(false);

  const _onChangeText = useCallback(
    (value: string) => {
      onChangePhone({...data, phone: value});
    },
    [onChangePhone, data],
  );

  const handleSelectNation = useCallback(
    (_nation: Nation) => {
      const na = PHONES.find(item => item.code === _nation.code);

      onChangePhone({...data, ...na});

      setIsvisible(false);
    },
    [onChangePhone, data],
  );

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
        <Image source={{uri: data?.url}} style={styles.flag} />
        <Image source={DropDownIcon} style={styles.dropDown} />
      </Pressable>
      <CustomInput
        value={data?.phone}
        onChangeText={_onChangeText}
        field="phone"
        inputMode="numeric"
        valueStyle={st.text_medium_gray_24}
        title={data?.code}
        maxLength={9}
        titleStyle={st.text_medium_24}
      />
    </View>
  );
};

export default memo(PhoneInput);

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
