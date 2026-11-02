import {TNotification, TUser} from '@types';

import {createContext} from 'react';

export type ContextProps = {
  isAuthenticated: boolean;
  initializing: boolean;
  pendingStep: 'phone' | 'profile' | null;
  refreshAuth: () => Promise<void>;
  currentUser: TUser | null;
  loading: boolean;
  signIn: (id: string) => Promise<boolean>;
  signUp: () => Promise<void>;
  signOut: () => Promise<void>;
  notify: TNotification | null;
  hideNotify: () => void;
  updateProfile: (update: TUser) => Promise<void>;
};

export const Context = createContext<ContextProps>({
  isAuthenticated: false,
  initializing: true,
  pendingStep: null,
  refreshAuth: async () => {},
  loading: false,
  signIn: async () => false,
  signOut: async () => {},
  signUp: async () => {},
  notify: null,
  hideNotify: () => {},
  updateProfile: async () => {},
  currentUser: null,
});
