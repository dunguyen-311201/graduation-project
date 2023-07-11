import React, {memo, useCallback, useState} from 'react';
import {FlatList, StyleSheet, View, Pressable} from 'react-native';

import CustomText from '../Text';
import {BLACK_COLOR, WHITE_COLOR} from '@theme';

type DropDownProps = {
  data: string[];
  initValue?: string;
  onSelect: (value: string, field: string) => void;
  field: string;
  zIndex?: number;
  title: string;
  disabled?: boolean;
};

const DropDown = ({
  data,
  initValue,
  onSelect,
  field,
  zIndex,
  disabled,
  title,
}: DropDownProps) => {
  const [isVisiable, setIsVisiable] = useState<boolean>(false);

  const handleDropdown = useCallback(() => {
    setIsVisiable(prev => !prev);
  }, []);

  const handleSelect = useCallback(
    (value: string) => {
      setIsVisiable(prev => !prev);
      onSelect(value, field);
    },
    [field, onSelect],
  );

  const renderItem = useCallback(
    ({item}: {item: string}) => {
      const handlePress = () => {
        handleSelect(item);
      };

      return (
        <Pressable onPress={handlePress} disabled={disabled}>
          <CustomText
            text={item}
            type="text_medium_20"
            customStyle={styles.dropDownItem}
          />
        </Pressable>
      );
    },
    [handleSelect],
  );

  const keyExtractor = useCallback((item: string) => item, []);

  return (
    <>
      <View
        style={{
          ...styles.dropDown,
          ...(zIndex && {zIndex}),
        }}>
        <CustomText text={title} type="text_medium_16" />
        <View style={styles.control}>
          <Pressable
            onPress={handleDropdown}
            disabled={disabled}
            style={styles.dropDownItem}>
            <CustomText text={initValue || data[0]} />
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

export default memo(DropDown);

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
