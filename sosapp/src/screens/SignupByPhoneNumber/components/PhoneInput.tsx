import {FlatList, Image, Pressable, StyleSheet, View} from 'react-native';
import React, {memo, useCallback, useState} from 'react';
import {CustomInput} from '@components/common';
import {PHONES} from '../../../constants';
import {Nation} from '@types';
import {WHITE_COLOR} from '@theme/color';
import {DropDownIcon} from '@theme/icon';
import NationSelect from './NationSelect';

import {Styles as st} from '@utils';

type PhoneInputProps = {
  nation: Nation;
  phone?: string;
  onChangePhone: (phone: string) => void;
  onChangeNation: (code: string) => void;
};

const PhoneInput = ({
  nation,
  phone,
  onChangePhone,
  onChangeNation,
}: PhoneInputProps) => {
  const [isVisible, setIsvisible] = useState(false);

  const handleChangeText = useCallback(
    (value: string) => {
      onChangePhone(value);
    },
    [onChangePhone],
  );

  const handleSelectNation = useCallback(
    (code: string) => {
      onChangeNation(code);
      setIsvisible(false);
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
        onChangeText={handleChangeText}
        field="phone"
        inputMode="numeric"
        valueStyle={st.text_medium_gray_24}
        title={nation?.code}
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
