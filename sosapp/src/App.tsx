import 'react-native-gesture-handler';

import {Context, ContextProps} from './context';
import {StyleSheet, View} from 'react-native';
import {useAuth, useNotification} from './hooks';

// import StorybookUIRoot from './.ondevice/Storybook';
import React from 'react';
import {RootNavigation} from './navigation';
import {SafeAreaView} from 'react-native-safe-area-context';

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
      <Context.Provider value={store}>
        <SafeAreaView style={styles.container}>
          <RootNavigation />
        </SafeAreaView>
      </Context.Provider>
    </View>
  );
}

export default App;

// export {StorybookUIRoot as default};

const styles = StyleSheet.create({
  container: {flex: 1},
});
