import {Context, ContextProps} from './context';
import {StyleSheet, View} from 'react-native';
import {useAuth} from '@features/auth';
import {useNotification} from '@features/notification';

import {BACKGROUND_COLOR} from '@theme';
import React from 'react';
import {RootNavigation} from './navigation';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar} from 'expo-status-bar';

function App() {
  const {
    currentUser,
    isAuthenticated,
    updateProfile,
    signIn,
    signOut,
    signUp,
    loading,
  } = useAuth();

  const {notify, hideNotify} = useNotification();

  const store: ContextProps = {
    isAuthenticated,
    loading,
    currentUser,
    signIn,
    signOut,
    signUp,
    notify,
    hideNotify,
    updateProfile,
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Context.Provider value={store}>
        <SafeAreaView style={styles.container}>
          <RootNavigation />
        </SafeAreaView>
      </Context.Provider>
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: BACKGROUND_COLOR},
});
