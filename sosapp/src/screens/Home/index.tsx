import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RootScreenNavigationProps} from '@navigation/RootNavigation';

const HomeScreen = () => {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<'Home'>>();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _navigateNext = useCallback(() => {
    navigate('Home');
  }, [navigate]);

  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
