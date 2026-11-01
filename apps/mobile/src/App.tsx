import {Context, ContextProps} from './context';
import {StyleSheet, View} from 'react-native';
import {useAuth} from '@features/auth';
import {useNotification} from '@features/notification';

import {ThemeProvider, tokens} from '@theme';
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
    <Context.Provider value={store}>
      <ThemeProvider>
        {scheme => (
          // Keyed by scheme: a theme change remounts the tree so every
          // screen re-reads the palette. Navigation state is kept.
          <View key={scheme} style={styles.container}>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
            <SafeAreaView style={styles.container}>
              <RootNavigation />
            </SafeAreaView>
          </View>
        )}
      </ThemeProvider>
    </Context.Provider>
  );
}

export default App;

const styles = tokens.themedStyles(() =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: tokens.colors.bg},
  }),
);
