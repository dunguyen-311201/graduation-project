import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';

import CustomText from '../Text';
import {BLACK_COLOR, WHITE_COLOR} from '@theme';

export type TDataDropDown = {id: string; value: string};

type DropDownProps = {
  data: TDataDropDown[];
  onSelect: (id: string) => void;
  title?: string;
  value?: string;
};

const DropDown = ({data, onSelect, value, title}: DropDownProps) => {
  const [isVisiable, setIsVisiable] = useState<boolean>(false);

  const initValue = useMemo(
    () => data.find(item => item.id === value)?.value,
    [data, value],
  );

  const handleDropdown = useCallback(() => {
    setIsVisiable(prev => !prev);
  }, []);

  const handleSelect = useCallback(
    (_value: string) => {
      setIsVisiable(prev => !prev);
      onSelect(_value);
    },
    [onSelect],
  );

  const renderItem = useCallback(
    ({item}: {item: TDataDropDown}) => {
      const handlePress = () => {
        handleSelect(item.id);
      };

      return (
        <Pressable onPress={handlePress}>
          <CustomText
            text={item.value}
            type="text_medium_20"
            customStyle={styles.dropDownItem}
          />
        </Pressable>
      );
    },
    [handleSelect],
  );

  const keyExtractor = useCallback((item: TDataDropDown) => item.id, []);

  return (
    <>
      <View
        style={{
          ...styles.dropDown,
        }}>
        <CustomText text={title} type="text_medium_16" />
        <View style={styles.control}>
          <Pressable onPress={handleDropdown} style={styles.dropDownItem}>
            <CustomText text={initValue} />
          </Pressable>

          {isVisiable && (
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              style={styles.list}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default DropDown;

const styles = StyleSheet.create({
  dropDown: {
    marginTop: 10,
    height: 72,
    position: 'relative',
    zIndex: 1,
  },
  control: {
    position: 'absolute',
    zIndex: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: WHITE_COLOR,
    left: 0,
    bottom: 0,
    right: 0,
  },
  list: {
    backgroundColor: BLACK_COLOR,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: 3,
    top: '100%',
    right: 0,
    left: 0,
    borderRadius: 10,
  },
  dropDownItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 40,
  },
});
