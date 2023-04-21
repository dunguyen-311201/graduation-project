import useAuth from '@hooks/useAuth';
import {TUser} from '@types';
import React, {createContext, useState, useMemo} from 'react';

export type ContextProps = {
  userInfo?: TUser;
  setUserInfo: React.Dispatch<React.SetStateAction<TUser | undefined>>;
  signInfo: (user: TUser) => Promise<void>;
};

export const Context = createContext<ContextProps>({
  setUserInfo: () => {},
  signInfo: async () => {},
});

export const ContextProvider = ({children}: {children: React.ReactNode}) => {
  const {currentUser, signupInfo} = useAuth();
  const [userInfo, setUserInfo] = useState<TUser>();

  const store: ContextProps = useMemo(
    () => ({
      userInfo,
      setUserInfo,
      signInfo: async (user: TUser) => {
        if (currentUser && user) {
          const displayName = `${user.firstName} ${user.lastName}`;
          await currentUser.updateProfile({displayName});
          await signupInfo(user);
        }
      },
    }),
    [currentUser, signupInfo, userInfo],
  );

  // useEffect(() => {
  //   const setup = async () => {
  //     setLoading(true);
  //     if (currentUser) {
  //       await currentUser.reload();
  //       const _isFirst = await getAsyncStorage(FIRST_INSTALLED);
  //       setIsFirst(_isFirst !== null);
  //       const user = (
  //         await firebase()
  //           .collection('users')
  //           .where('uid', '==', currentUser.uid)
  //           .get()
  //       ).docs[0]?.data();

  //       if (user && user !== null) {
  //         setUserInfo(prev => ({
  //           ...prev,
  //           ...user,
  //           isAuthenticated: true,
  //         }));
  //         return;
  //       }
  //       setUserInfo(prev => ({...prev, isAuthenticated: false}));
  //     }
  //     setLoading(false);
  //   };

  //   setup();
  // }, [currentUser]);

  return <Context.Provider value={store}>{children}</Context.Provider>;
};
