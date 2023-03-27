import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
import CustomText from '../../Text';
import {NationProps} from '../../../../types';
import {DropDown} from '../../../../themes';

export const NationImage = ({
  uri,
  isDropIcon,
  onPress,
}: {
  uri: string;
  isDropIcon?: boolean;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.nationGroup} onPress={onPress}>
      <Image source={{uri}} style={styles.nationImg} />
      {isDropIcon && <Image source={DropDown} />}
    </TouchableOpacity>
  );
};

const NationOption = ({
  nation,
  isDetails,
  onPress,
}: {
  nation: NationProps;
  onPress?: (code: string) => void;
  isDetails?: boolean;
}) => {
  const {uri, code, name} = nation;

  const _onPress = useCallback(() => {
    onPress && onPress(code);
  }, [code, onPress]);

  return (
    <TouchableOpacity style={styles.container} onPress={_onPress}>
      <View style={styles.nationGroup}>
        <NationImage uri={uri} />
        {isDetails && <CustomText text={name} />}
      </View>
      {isDetails && <CustomText text={code} />}
    </TouchableOpacity>
  );
};

export default NationOption;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  nationGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  nationImg: {
    width: 52,
    height: 31,
    marginRight: 12,
  },
});
