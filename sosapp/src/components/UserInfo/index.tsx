import React, {memo} from 'react';
import {StyleSheet, Pressable, View} from 'react-native';

import {TUser} from '@types';
import {GRAY_COLOR, TEXT_COLOR} from '@theme';
import {CustomText} from '../common';

type UserInfoProps = {
  user: TUser;
  marginLeft?: number;
  disabled?: boolean;
  onLongPress?: () => void;
};
const UserInfo = ({user, marginLeft, onLongPress, disabled}: UserInfoProps) => {
  return (
    <Pressable
      style={[
        styles.container,
        {marginLeft},
        {...(disabled && styles.disabled)},
      ]}
      disabled={disabled}
      onLongPress={onLongPress}>
      <View style={styles.row}>
        <CustomText text="Name: " type="text_medium_14" color="black" />
        <CustomText
          text={`${user?.firstName} ${user?.lastName}`}
          type="text_medium_14"
          color="blue"
        />
      </View>

      <View style={styles.row}>
        <CustomText text="Phone: " type="text_medium_14" color="black" />
        <CustomText
          text={`${user?.phoneNumber}`}
          type="text_medium_14"
          color="blue"
        />
      </View>
    </Pressable>
  );
};

export default memo(UserInfo);

const styles = StyleSheet.create({
  container: {
    maxWidth: '50%',
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
