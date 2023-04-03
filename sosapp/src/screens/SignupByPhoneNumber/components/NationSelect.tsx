import {StyleSheet, View} from 'react-native';
import React, {useCallback} from 'react';
import {Pressable} from 'react-native';
import {Image} from 'react-native';
import {CustomText} from '@components/common';
import {Nation} from '@types';

const NationSelect = ({
  nation,
  onSelect,
}: {
  nation: Nation;
  onSelect: (nation: Nation) => void;
}) => {
  const onSelectNation = useCallback(() => {
    onSelect(nation);
  }, [onSelect, nation]);

  return (
    <Pressable style={styles.nationOption} onPress={onSelectNation}>
      <View style={styles.nationInfo}>
        <Image source={{uri: nation.url}} style={styles.flag} />
        <CustomText
          text={nation.name}
          style={['fs5', 'fw4', 'cbla']}
          customStyle={styles.name}
        />
      </View>
      <CustomText text={nation.code} style={['fw6', 'fs6', 'cbl']} />
    </Pressable>
  );
};

export default NationSelect;

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
