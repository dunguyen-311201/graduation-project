import {FlatList, StyleSheet, View, Pressable} from 'react-native';
import React, {useCallback, useState} from 'react';
import CustomText from '../Text';
import {BACKGROUND_COLOR, WHITE_COLOR} from '@theme/color';

type DropDownProps = {
  data: string[];
  initValue: string;
  onSelect: (value: string, field: string) => void;
  field: string;
};

const DropDown = ({data, initValue, onSelect, field}: DropDownProps) => {
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
        console.log(item);
        handleSelect(item);
      };

      return (
        <Pressable onPress={handlePress}>
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
    <View
      style={{
        ...styles.dropDown,
        ...(isVisiable && {...styles.openList, height: data.length * 40}),
      }}>
      {!isVisiable && (
        <Pressable onPress={handleDropdown} style={styles.dropDownItem}>
          <CustomText
            text={initValue || 'Select type emergency'}
            type="text_medium_20"
          />
        </Pressable>
      )}
      {isVisiable && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={{...styles.list, ...(isVisiable && {})}}
        />
      )}
    </View>
  );
};

export default DropDown;

const styles = StyleSheet.create({
  dropDown: {
    height: 50,
    width: '100%',
    position: 'absolute',
    zIndex: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: WHITE_COLOR,
    marginTop: 20,
  },
  list: {
    backgroundColor: BACKGROUND_COLOR,
  },
  dropDownItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  openList: {
    overflow: 'scroll',
  },
});
