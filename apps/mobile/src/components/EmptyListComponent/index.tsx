import {StyleSheet, View} from 'react-native';

import {CustomText} from '../common';
import React from 'react';

const EmptyListComponent = ({text}: {text?: string}) => {
  return (
    <View style={styles.container}>
      <CustomText text={text || 'No items to display'} color="blue" />
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
