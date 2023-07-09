import {createContext} from 'react';

import {TNotification, TUser} from '@types';

export type ContextProps = {
  isAuthenticated: boolean;
  currentUser?: TUser;
  loading: boolean;
  signIn: (id: string) => Promise<void>;
  signUp: () => Promise<void>;
  signOut: () => Promise<void>;
  notify: TNotification | null;
  hideNotify: () => void;
  firstSignedIn: boolean;
};

export const Context = createContext<ContextProps>({
  isAuthenticated: false,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  notify: null,
  hideNotify: () => {},
  firstSignedIn: false,
});
