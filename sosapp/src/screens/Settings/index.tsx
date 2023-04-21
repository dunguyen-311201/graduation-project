import {StyleSheet, View, Text} from 'react-native';
import React from 'react';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Setting</Text>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
