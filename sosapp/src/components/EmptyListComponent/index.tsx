import {StyleSheet, View} from 'react-native';
import React from 'react';
import {CustomText} from '../common';

const EmptyListComponent = () => {
  return (
    <View style={styles.container}>
      <CustomText text="No items to display" color="blue" />
    </View>
  );
};

export default EmptyListComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },
});
