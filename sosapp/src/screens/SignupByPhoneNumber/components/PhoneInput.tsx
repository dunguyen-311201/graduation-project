import {FlatList, Image, Pressable, StyleSheet, View} from 'react-native';
import React, {memo, useCallback, useState} from 'react';
import {CustomInput} from '@components/common';
import {PHONES} from '../../../constants';
import {Nation} from '@types';
import {WHITE_COLOR} from '@theme/color';
import {DropDownIcon} from '@theme/image';
import NationSelect from './NationSelect';

import {Styles as st} from '@utils';

type PhoneInputProps = {
  nation: Nation;
  phone?: string;
  onEndEditing?: () => void;
  onChangePhone: (phone: string) => void;
  onChangeNation: (_nation: Nation) => void;
};

const PhoneInput = ({
  nation,
  phone,
  onChangePhone,
  onChangeNation,
  onEndEditing,
}: PhoneInputProps) => {
  const [isVisible, setIsvisible] = useState(false);

  const handleSelectNation = useCallback(
    (code: string) => {
      const _nation = PHONES.find(item => item.code === code);
      if (_nation) {
        onChangeNation(_nation);
        setIsvisible(false);
      }
    },
    [onChangeNation],
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
        <Image source={{uri: nation?.url}} style={styles.flag} />
        <Image source={DropDownIcon} style={styles.dropDown} />
      </Pressable>

      <CustomInput
        value={phone}
        onChangeText={onChangePhone}
        field="phone"
        inputMode="numeric"
        title={nation?.code}
        onEndEditing={onEndEditing}
        maxLength={11}
      />
    </View>
  );
};

export default memo(PhoneInput);

const styles = StyleSheet.create({
  phoneinput: {
    position: 'relative',
    flexDirection: 'row',
    zIndex: 2,
    marginTop: 20,
  },

  nationList: {
    backgroundColor: WHITE_COLOR,
    borderRadius: 10,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 3,
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
