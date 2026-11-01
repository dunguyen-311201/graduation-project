import {DARK_GRAY_COLOR, DropDownIcon, WHITE_COLOR} from '@theme';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import type {TextInputInstance} from 'react-native';
import React, {memo, useCallback, useRef, useState} from 'react';

import {CustomText} from '@components';
import {Nation} from '@types';
import NationSelect from './NationSelect';
import {PHONES} from '@constants';

type PhoneInputProps = {
  errorMessage?: string;
  onEndEditing: (value: string) => void;
};

const MIN_DIGITS = 9;

const maxDigits = (code?: string) => (code === '+84' ? 9 : 10);

const PhoneInput = ({onEndEditing, errorMessage}: PhoneInputProps) => {
  const [isVisible, setIsvisible] = useState(false);
  const [phone, setPhone] = useState('');
  const refInput = useRef<TextInputInstance>(null);
  const [national, setNational] = useState<Nation | undefined>(PHONES.at(0));

  const updatePhone = useCallback(
    (value: string, nation?: Nation) => {
      // People usually type the national 0 prefix, which E.164 leaves out.
      const digits = value
        .replace(/\D/g, '')
        .replace(/^0+/, '')
        .slice(0, maxDigits(nation?.code));

      setPhone(digits.replace(/(\d{3})(?=\d)/g, '$1 '));
      onEndEditing(digits.length >= MIN_DIGITS ? nation?.code + digits : '');

      if (digits.length === maxDigits(nation?.code)) {
        refInput.current?.blur();
      }
    },
    [onEndEditing],
  );

  const handleSelectNation = useCallback(
    (code: string) => {
      const _nation = PHONES.find(item => item.code === code);
      if (_nation) {
        setNational(_nation);
        setIsvisible(false);
        updatePhone(phone, _nation);
      }
    },
    [phone, updatePhone],
  );

  const handleChangePhone = useCallback(
    (value: string) => updatePhone(value, national),
    [national, updatePhone],
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
          <Pressable
            style={styles.flagSelect}
            onPress={handleVisibleSelect}
            accessibilityRole="button"
            accessibilityLabel={`Country code ${national?.name}`}>
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
            inputMode="tel"
            autoComplete="tel-national"
            accessibilityLabel="Phone number"
            placeholder="912 345 678"
            placeholderTextColor={DARK_GRAY_COLOR}
            ref={refInput}
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
    color: WHITE_COLOR,
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
