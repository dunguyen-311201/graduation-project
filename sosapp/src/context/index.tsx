import React, {createContext, useState} from 'react';

export type ContextProps = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const Context = createContext<ContextProps>({
  loading: false,
  setLoading: () => {},
});

export const ContextProvider = ({children}: {children: React.ReactNode}) => {
  const [loading, setLoading] = useState(false);

  const store: ContextProps = {loading, setLoading};

  return <Context.Provider value={store}>{children}</Context.Provider>;
};
