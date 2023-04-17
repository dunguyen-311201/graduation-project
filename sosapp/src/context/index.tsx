import React, {createContext} from 'react';
import {create} from 'zustand';

export type ContextProps = {
  children?: React.ReactNode;
  color?: string;
  setColor?: (value: string) => void;
};

export const Context = createContext<ContextProps>({color: '#FFFFFF'});

const useStore = create<ContextProps>(set => {
  return {
    setColor: (value: string) => set({color: value}),
  };
});

export const ContextProvider = ({children}: ContextProps) => {
  const store = useStore();

  return <Context.Provider value={store}>{children}</Context.Provider>;
};
