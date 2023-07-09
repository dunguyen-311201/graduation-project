import React, {memo} from 'react';
import {StyleSheet, Pressable, View, ViewStyle} from 'react-native';

import {GRAY_COLOR, TEXT_COLOR} from '@theme';
import {CustomText} from '../common';
import useUsers from '@hooks/useUsers';
import {StyleProp} from 'react-native';

type UserInfoProps = {
  id?: string;
  marginLeft?: number;
  disabled?: boolean;
  onLongPress?: () => void;
  customStyle?: StyleProp<ViewStyle>;
};

const UserInfo = ({
  id,
  marginLeft,
  onLongPress,
  disabled,
  customStyle,
}: UserInfoProps) => {
  const {user} = useUsers(id);

  return (
    <Pressable
      style={[
        customStyle,
        styles.container,
        {marginLeft},
        {...(disabled && styles.disabled)},
      ]}
      disabled={disabled}
      onLongPress={onLongPress}>
      {user?.displayName && (
        <View style={styles.row}>
          <CustomText
            text={user.displayName}
            type="text_medium_14"
            color="blue"
          />
        </View>
      )}

      {user?.phoneNumber ? (
        <View style={styles.row}>
          <CustomText
            text={user.phoneNumber || ''}
            type="text_medium_14"
            color="black"
          />
        </View>
      ) : (
        <View style={styles.row}>
          <CustomText
            text={user?.email || ''}
            type="text_medium_14"
            color="black"
          />
        </View>
      )}
    </Pressable>
  );
};

export default memo(UserInfo);

const styles = StyleSheet.create({
  container: {
    height: 64,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: TEXT_COLOR,
    alignSelf: 'flex-start',
    borderRadius: 10,
  },
  disabled: {
    backgroundColor: GRAY_COLOR,
  },
  row: {
    flexDirection: 'row',
  },
});
