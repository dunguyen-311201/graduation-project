import {StyleSheet, View} from 'react-native';
import React, {memo, useCallback} from 'react';
import {Pressable} from 'react-native';
import {Image} from 'react-native';
import {CustomText} from '@components/common';
import {Nation} from '@types';

type NationSelectProps = {
  nation: Nation;
  onSelect: (code: string) => void;
};

const NationSelect = ({nation, onSelect}: NationSelectProps) => {
  const onSelectNation = useCallback(() => {
    onSelect(nation.code);
  }, [onSelect, nation.code]);

  return (
    <Pressable style={styles.nationOption} onPress={onSelectNation}>
      <View style={styles.nationInfo}>
        <Image source={{uri: nation.url}} style={styles.flag} />
        <CustomText text={nation.name} type="text_medium_20" color="black" />
      </View>
      <CustomText text={nation.code} type="text_medium_20" color="black" />
    </Pressable>
  );
};

export default memo(NationSelect);

const styles = StyleSheet.create({
  nationOption: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  nationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  name: {
    marginLeft: 10,
  },
  flagSelect: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    width: 52,
    height: 31,
  },
});
