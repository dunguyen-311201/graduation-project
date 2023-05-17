import {createContext} from 'react';

export type ContextProps = {
  onAuthenticated: (state: boolean) => void;
  isAuthenticated: boolean;
  muids: string[];
  addMessage: (uid: string) => void;
  removeMessage: (uid: string) => void;
};

export const Context = createContext<ContextProps>({
  onAuthenticated: () => {},
  isAuthenticated: false,
  muids: [],
  addMessage: () => {},
  removeMessage: () => {},
});
