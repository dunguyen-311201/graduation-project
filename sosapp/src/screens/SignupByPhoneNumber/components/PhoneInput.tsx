import {DARK_GRAY_COLOR, DropDownIcon, WHITE_COLOR} from '@theme';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import React, {memo, useCallback, useRef, useState} from 'react';

import {CustomText} from '@components';
import {Nation} from '@types';
import NationSelect from './NationSelect';
import {PHONES} from '@constants';

type PhoneInputProps = {
  errorMessage?: string;
  onEndEditing: (value: string) => void;
};

const PhoneInput = ({onEndEditing, errorMessage}: PhoneInputProps) => {
  const [isVisible, setIsvisible] = useState(false);
  const [phone, setPhone] = useState('');
  const refInput = useRef<TextInput>();
  const [national, setNational] = useState<Nation | undefined>(PHONES.at(0));

  const handleSelectNation = useCallback((code: string) => {
    const _nation = PHONES.find(item => item.code === code);
    if (_nation) {
      setNational(_nation);
      setIsvisible(false);
    }
  }, []);

  const handleChangePhone = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, '');
    let formatted;

    if (value.length < 6) {
      formatted = cleaned.replace(/(\d{3})(\d{1})/, '$1 $2');
    } else if (value.length === 6) {
      formatted = cleaned.replace(/(\d{3})(\d{3})/, '$1 $2');
    } else {
      formatted = cleaned.replace(/(\d{3})(\d{3})(\d{1})/, '$1 $2 $3');
    }

    if (formatted.length === 11) {
      refInput.current?.blur();
      onEndEditing(national?.code + cleaned);
    }

    setPhone(formatted);
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
            <Image source={{uri: national?.url}} style={styles.flag} />
            <Image source={DropDownIcon} style={styles.dropDown} />
          </Pressable>
          <CustomText text={national?.code} type="text_medium_24" />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={handleChangePhone}
            inputMode="numeric"
            maxLength={11}
            ref={refInput}
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
