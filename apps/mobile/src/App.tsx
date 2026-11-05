import {Context, ContextProps} from './context';
import {StyleSheet, View} from 'react-native';
import {useAuth} from '@features/auth';
import {useNotification} from '@features/notification';

import ThemeProvider from './theme/ThemeProvider';
import {colors, themedStyles} from './theme/tokens';
import React, {useEffect} from 'react';
import * as NativeSplash from 'expo-splash-screen';
import {RootNavigation} from './navigation';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar} from 'expo-status-bar';

// One splash only: the native one stays until the saved session is checked.
NativeSplash.preventAutoHideAsync().catch(() => {});

function App() {
  const {
    currentUser,
    isAuthenticated,
    initializing,
    pendingStep,
    refreshAuth,
    updateProfile,
    signIn,
    signOut,
    signUp,
    loading,
  } = useAuth();

  const {notify, hideNotify} = useNotification();

  useEffect(() => {
    if (!initializing) {
      NativeSplash.hideAsync().catch(() => {});
    }
  }, [initializing]);

  const store: ContextProps = {
    isAuthenticated,
    initializing,
    pendingStep,
    refreshAuth,
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

const styles = themedStyles(() =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.bg},
  }),
);
