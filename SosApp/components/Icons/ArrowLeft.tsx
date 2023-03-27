import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {ArrowLeft} from '../../themes';

const ArrowLeftIcon = ({onPress}: {onPress: () => void}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={ArrowLeft} style={styles.icon} />
    </TouchableOpacity>
  );
};

export default ArrowLeftIcon;

const styles = StyleSheet.create({
  icon: {
    width: 16,
    height: 16,
  },
});
