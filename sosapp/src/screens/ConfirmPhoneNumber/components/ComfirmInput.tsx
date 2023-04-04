import {FlatList, StyleSheet, TextInput, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {CustomInput} from '@components/common';
import {Styles as st} from '@utils';

type TCode = {
  F1: string;
  F2: string;
  F3: string;
  F4: string;
  F5: string;
  F0: string;
};

type ComfirmInputProps = {
  value?: string;
  onChangeText: (value: string) => void;
};
const ComfirmInput = ({onChangeText}: ComfirmInputProps) => {
  const [code, setCode] = useState<TCode>({
    F0: '',
    F1: '',
    F2: '',
    F3: '',
    F4: '',
    F5: '',
  });
  const refs = useRef<TextInput[]>([]);

  useEffect(() => {
    onChangeText(Object.values(code).join(''));
  }, [code, onChangeText]);

  const _onChangeText = useCallback((_value: string, field: string) => {
    try {
      const f = parseInt(field.replace('F', ''), 10);
      if (_value === '') {
        setCode(prev => ({...prev, [field]: _value}));
        if (refs?.current[f - 1]) {
          refs?.current[f - 1].focus();
        }
      }
      if (isNaN(parseInt(_value, 10))) {
        return;
      }
      if (typeof parseInt(_value, 10) !== 'number') {
        return;
      }
      setCode(prev => ({...prev, [field]: _value}));
      if (refs?.current[f + 1] && _value) {
        refs?.current[f + 1].focus();
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const _renderItem = useCallback(
    ({item, index}: {item: string; index: number}) => (
      <CustomInput
        field={`F${index}`}
        onChangeText={_onChangeText}
        value={item}
        maxLength={1}
        valueStyle={st.text_regular_27}
        inputMode="numeric"
        ref={input => {
          if (input !== null) {
            refs.current[index] = input;
          }
        }}
      />
    ),
    [_onChangeText],
  );
  const _keyExtractor = useCallback(
    (item: string, index: number) => index + '',
    [],
  );

  const separator = useCallback(
    () => <View style={styles.confirmNumber} />,
    [],
  );

  return (
    <FlatList
      data={Object.values(code).map(_code => _code + '')}
      renderItem={_renderItem}
      keyExtractor={_keyExtractor}
      ItemSeparatorComponent={separator}
      horizontal
    />
  );
};

export default ComfirmInput;

const styles = StyleSheet.create({
  confirmNumber: {
    width: 16,
  },
});
