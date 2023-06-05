import {createContext} from 'react';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export type ContextProps = {
  onAuthenticated: (state: boolean) => void;
  isAuthenticated: boolean;
  muids: string[];
  addMessage: (uid: string) => void;
  removeMessage: (uid: string) => void;
  currentUser: FirebaseAuthTypes.User | null;
};

export const Context = createContext<ContextProps>({
  onAuthenticated: () => {},
  isAuthenticated: false,
  muids: [],
  addMessage: () => {},
  removeMessage: () => {},
  currentUser: null,
});
