import {getAsyncStorage} from '@utils/asyncStorage';
import React, {createContext, useEffect, useState} from 'react';

export type ContextProps = {
  children?: React.ReactNode;
  isFirstAuthenticated?: boolean;
  setIsFirstAuthenticated?: (value: boolean) => void;
};

export const Context = createContext<ContextProps>({
  isFirstAuthenticated: true,
  setIsFirstAuthenticated: (value: boolean) => {
    value;
  },
});

export const ContextProvider = ({children}: ContextProps) => {
  const [store, setStore] = useState<ContextProps>({});

  useEffect(() => {
    const setup = async () => {
      const isNew = await getAsyncStorage('isNew');
      setStore({isFirstAuthenticated: isNew === null});
    };

    setup();
  }, []);

  return <Context.Provider value={store}>{children}</Context.Provider>;
};
