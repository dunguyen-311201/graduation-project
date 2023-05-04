import React, {createContext, useMemo} from 'react';

export type ContextProps = {};

export const Context = createContext<ContextProps>({});

export const ContextProvider = ({children}: {children: React.ReactNode}) => {
  const store: ContextProps = useMemo(() => ({}), []);

  return <Context.Provider value={store}>{children}</Context.Provider>;
};
