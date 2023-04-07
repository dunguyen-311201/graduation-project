import {getAsyncStorage, setAsyncStorage} from '@utils/asyncStorage';
import React, {createContext, useEffect, useState} from 'react';
import {create} from 'zustand';

export type ContextProps = {
  isNew: boolean;
};

const initContext: any = {};

const Context = createContext<any>(initContext);

type ContextProvideProps = {
  children: React.ReactNode;
};

export const ContextProvide = ({children}: ContextProvideProps) => {
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    async function setup() {
      const isNewInstall = await getAsyncStorage('new');
      if (isNewInstall === null) {
        await setAsyncStorage('new', '1');
        setIsNew(false);
        return;
      }
      setIsNew(true);
    }
    setup();
  }, [isNew]);

  const baseStore = create<ContextProps>(set => {
    return {
      isNew: true,
      setIsNew: () => set({isNew: false}),
    };
  });

  return <Context.Provider value={baseStore}>{children}</Context.Provider>;
};
