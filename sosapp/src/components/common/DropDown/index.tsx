import {FlatList, StyleSheet, Text, View, Pressable} from 'react-native';
import React, {useCallback, useState} from 'react';
import CustomText from '../Text';
import {DARK_GRAY_COLOR, WHITE_COLOR} from '@theme/color';

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

  const renderItem = useCallback(({item}: {item: string}) => {
    const handlePress = () => {
      console.log(item);
      handleSelect(item);
    };

    return (
      <Pressable onPress={handlePress}>
        <CustomText
          text={item}
          type="text_medium_18"
          color="blue"
          customStyle={styles.dropDownItem}
        />
      </Pressable>
    );
  }, []);

  const keyExtractor = useCallback((item: string) => item, []);

  return (
    <View style={styles.dropDown}>
      <CustomText text="Type" type="text_medium_20" />
      <View style={styles.lable}>
        <CustomText
          text={initValue}
          onPress={handleDropdown}
          type="text_medium_18"
          customStyle={styles.dropDownItem}
        />

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
  );
};

export default DropDown;

const styles = StyleSheet.create({
  dropDown: {
    marginBottom: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: WHITE_COLOR,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  lable: {
    position: 'relative',
    zIndex: 2,
    flex: 1,
    marginLeft: 20,
  },
  list: {
    position: 'absolute',
    width: '100%',
    height: 100,
    overflow: 'scroll',
    zIndex: 3,
  },
  dropDownItem: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: DARK_GRAY_COLOR,
    marginBottom: 1,
    borderRadius: 8,
  },
});
