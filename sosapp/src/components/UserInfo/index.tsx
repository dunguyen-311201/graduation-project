import {
  Alert,
  Linking,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {CustomButton, CustomText} from '../common';
import {GRAY_COLOR, TEXT_COLOR} from '@theme';
import React, {memo, useCallback} from 'react';

import {useUsers} from '@hooks';

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

  const makePhoneCall = useCallback((phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;

    Linking.canOpenURL(phoneUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          Alert.alert(
            'Phone Call Not Supported',
            'Please try contacting through alternative methods.',
          );
        }
      })
      .catch(error => console.log(error));
  }, []);

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
            type="text_medium_16"
            color="black"
          />
        </View>
      )}

      {user?.phoneNumber ? (
        <View style={styles.row}>
          <CustomButton
            label={user.phoneNumber}
            onPress={makePhoneCall}
            type="secondary"
            customStyle={styles.phone}
          />
        </View>
      ) : (
        <View style={styles.row}>
          <CustomText
            text={user?.email || ''}
            type="text_medium_14"
            color="blue"
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
  phone: {
    fontSize: 14,
  },
});
