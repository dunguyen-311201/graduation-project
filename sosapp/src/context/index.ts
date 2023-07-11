import {TNotification, TUser} from '@types';

import {createContext} from 'react';

export type ContextProps = {
  isAuthenticated: boolean;
  currentUser: TUser | null;
  loading: boolean;
  signIn: (id: string) => Promise<void>;
  signUp: () => Promise<void>;
  signOut: () => Promise<void>;
  notify: TNotification | null;
  hideNotify: () => void;
  updateProfile: (update: TUser) => Promise<void>;
};

export const Context = createContext<ContextProps>({
  isAuthenticated: false,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  notify: null,
  hideNotify: () => {},
  updateProfile: async () => {},
  currentUser: null,
});
