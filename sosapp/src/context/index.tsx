import React, {createContext, useEffect} from 'react';
import {create} from 'zustand';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {View} from 'react-native';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RootNavigation from '@navigation/RootNavigation';

export type ContextProps = {
  currentUser: FirebaseAuthTypes.User | null;
  setCurrentUser: (user: FirebaseAuthTypes.User) => void;
  handleLogout: () => Promise<void>;
};

export const Context = createContext<ContextProps>({
  currentUser: null,
  setCurrentUser: () => {},
  handleLogout: () => Promise.resolve(),
});

const useStore = create<ContextProps>(set => {
  return {
    currentUser: auth().currentUser as FirebaseAuthTypes.User,
    setCurrentUser: (currentUser: FirebaseAuthTypes.User) => set({currentUser}),
    handleLogout: () => auth().signOut(),
  };
});

export const ContextProvider = () => {
  const store = useStore();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      if (user) {
        store.setCurrentUser(user);
      }
    });

    return subscriber;
  }, [store]);

  return (
    <Context.Provider value={store}>
      <SafeAreaView style={styles.container}>
        <RootNavigation />
      </SafeAreaView>
    </Context.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
});
