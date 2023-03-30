import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {CustomInput, CustomText} from '@components/common';
import {PHONES} from '../../../constants';
import {Nation} from '@types';
import {BLACK_COLOR, WHITE_COLOR} from '@theme/color';

type INation = Nation & {phone?: string};

const PhoneInput = () => {
  const [nation, setNation] = useState<INation>({
    ...PHONES[0],
  });

  const _onChangeText = useCallback((value: string, field: string) => {
    if (nation) {
      setNation(_nation => {
        ({..._nation, [field]: value});
      });
    }
  }, []);

  const _renderItem = useCallback(
    ({item}: {item: Nation}) => (
      <View style={styles.nationOption}>
        <View style={styles.nationInfo}>
          <Image source={{uri: item.url}} style={styles.flag} />
          <Text>{item.name}</Text>
        </View>
        <CustomText text={item.code} style={['fw6', 'fs6']} />
      </View>
    ),
    [],
  );

  const _keyExtractor = useCallback(({code}: Nation) => code, []);

  return (
    <View style={styles.phoneinput}>
      <FlatList
        style={styles.nationList}
        data={PHONES}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
      />
      <Image source={{uri: nation?.url}} />
      <CustomInput
        value={nation?.phone || ''}
        onChangeText={_onChangeText}
        field={typeof nation}
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
  },
  nationOption: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderBottomColor: BLACK_COLOR,
    borderBottomWidth: 1,
    position: 'absolute',
  },
  nationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    width: 52,
    height: 31,
  },
});
