import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {CustomText} from '../common';

const Error = ({message}: {message: string}) => {
  return (
    <View style={styles.container}>
      <CustomText text={message} type="text_medium_18" color="red" />
    </View>
  );
};

export default memo(Error);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 2,
    bottom: 16,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    opacity: 0.8,
    alignItems: 'center',
  },
});
