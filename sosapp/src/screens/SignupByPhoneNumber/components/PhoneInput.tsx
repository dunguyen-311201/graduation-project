import {
  FlatList,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import React, {memo, useCallback, useState} from 'react';

import {Nation} from '@types';
import {PHONES} from '@constants';
import {CustomText} from '@components';
import NationSelect from './NationSelect';
import {WHITE_COLOR, DropDownIcon, DARK_GRAY_COLOR} from '@theme';

type PhoneInputProps = {
  field: string;
  errorMessage?: string;
  onEndEditing: (value: string, field: string) => void;
};

const PhoneInput = ({field, onEndEditing, errorMessage}: PhoneInputProps) => {
  const [isVisible, setIsvisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [national, setNational] = useState<Nation>(PHONES.at(0));

  const handleSelectNation = useCallback((code: string) => {
    const _nation = PHONES.find(item => item.code === code);
    if (_nation) {
      setNational(_nation);
      setIsvisible(false);
    }
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

  const handleEndEdit = useCallback(() => {
    if (national && phone) {
      onEndEditing(national.code + phone, field);
    }
  }, [national, phone]);

  return (
    <View style={styles.container}>
      <View style={styles.phoneInput}>
        {isVisible && (
          <FlatList
            style={styles.nationList}
            data={PHONES}
            renderItem={_renderItem}
            keyExtractor={_keyExtractor}
            overScrollMode="always"
          />
        )}
        <View style={styles.nation}>
          <Pressable style={styles.flagSelect} onPress={handleVisibleSelect}>
            <Image source={{uri: national.url}} style={styles.flag} />
            <Image source={DropDownIcon} style={styles.dropDown} />
          </Pressable>
          <CustomText text={national.code} type="text_medium_24" />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            onEndEditing={handleEndEdit}
            inputMode="numeric"
            maxLength={9}
            selectTextOnFocus
          />
          {errorMessage && (
            <CustomText text={errorMessage} color="red" type="text_medium_14" />
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(PhoneInput);

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
    position: 'relative',
    zIndex: 2,
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // flex: 10,
  },
  inputGroup: {flex: 6},
  input: {
    borderBottomWidth: 1,
    borderBottomColor: WHITE_COLOR,
    color: DARK_GRAY_COLOR,
    fontSize: 24,

    padding: 0,
  },
  nationList: {
    backgroundColor: WHITE_COLOR,
    borderRadius: 10,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 3,
    height: 200,
  },
  nation: {
    flexDirection: 'row',
    columnGap: 10,
    flex: 4,
  },
  flagSelect: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  flag: {
    width: 52,
    height: 31,
  },
  dropDown: {
    marginLeft: 5,
  },
});
