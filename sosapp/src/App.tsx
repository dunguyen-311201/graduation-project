// import StorybookUIRoot from './.ondevice/Storybook';
import React, {useState, useEffect} from 'react';
import 'react-native-gesture-handler';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useAuth, useNotification} from './hooks';
import {RootNavigation} from './navigation';
import {Context, ContextProps} from './context';
import {getAsyncStorage} from './utils';
import {FIRST_INSTALLED} from './constants';

function App() {
  const {currentUser, isAuthenticated, signIn, signOut, signUp, loading} =
    useAuth();
  const [firstSignedIn, setFirstSignedIn] = useState(false);
  const [_loading, setLoading] = useState(loading);

  const {notify, hideNotify} = useNotification();

  useEffect(() => {
    const setup = async () => {
      setLoading(true);
      const cache = await getAsyncStorage(FIRST_INSTALLED);
      if (!cache) {
        setFirstSignedIn(true);
        return;
      }
      setLoading(false);
    };

    setup();
  }, [isAuthenticated]);

  const store: ContextProps = {
    isAuthenticated,
    loading: _loading,
    currentUser,
    signIn,
    signOut,
    signUp,
    notify,
    hideNotify,
    firstSignedIn,
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
