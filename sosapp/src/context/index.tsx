import {UserProfile} from '@types';
import React, {createContext, useEffect} from 'react';
import {create} from 'zustand';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

export type ContextProps = {
  userProfile: UserProfile;
  setUserProfile: (user: UserProfile) => void;
  isAuthenticated: boolean;
};

export const Context = createContext<ContextProps>({} as ContextProps);

type ContextProvideProps = {
  children: React.ReactNode;
};
const useStore = create<ContextProps>(set => {
  const _user = auth().currentUser as FirebaseAuthTypes.User;
  return {
    userProfile: {user: _user},
    setUserProfile: (user: UserProfile) => set({userProfile: user}),
    isAuthenticated: false,
  };
});

export const ContextProvider = ({children}: ContextProvideProps) => {
  const store = useStore();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      if (user) {
        store.setUserProfile({user});
        store.isAuthenticated = true;
      } else {
        store.isAuthenticated = false;
      }
    });

    return subscriber();
  }, [store]);

  return <Context.Provider value={store}>{children}</Context.Provider>;
};
