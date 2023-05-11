import {createContext} from 'react';

export type ContextProps = {
  onAuthenticated: (state: boolean) => void;
  isAuthenticated: boolean;
  isCompleted: boolean;
  onCompleted: (state: boolean) => void;
};

export const Context = createContext<ContextProps>({
  onAuthenticated: () => {},
  isAuthenticated: false,
  isCompleted: true,
  onCompleted: () => {},
});
