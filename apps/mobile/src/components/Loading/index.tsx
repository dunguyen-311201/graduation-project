import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';

const Loading = () => {
  return (
    <Modal transparent={true} animationType="none" visible={true}>
      <View style={styles.container}>
        <ActivityIndicator size={'large'} />
      </View>
    </Modal>
  );
};

export default memo(Loading);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  loadingImage: {width: 150, height: 150},
});
