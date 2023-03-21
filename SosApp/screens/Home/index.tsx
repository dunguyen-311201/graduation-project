import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RootScreenNavigationProps} from '../../navigation/RootNavigation';
import {SCREEN} from '../../enums';

const HomeScreen = () => {
  const {setOptions} =
    useNavigation<RootScreenNavigationProps<SCREEN.SLASH_SCREEN>>();

  useEffect(() => {
    setOptions({
      headerShown: false,
    });
  }, [setOptions]);

  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
