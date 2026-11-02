import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Scheme, applyScheme, currentScheme} from './tokens';

export type ThemePreference = 'system' | Scheme;

const KEY = 'theme-preference';
// Dark stays the default: the app was designed dark first.
const DEFAULT: ThemePreference = 'dark';

type ThemeContextValue = {
  scheme: Scheme;
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  scheme: 'dark',
  preference: DEFAULT,
  setPreference: () => {},
});

export const useTheme = () => useContext(ThemeContext);

type Props = {children: (scheme: Scheme) => React.ReactNode};

const ThemeProvider = ({children}: Props) => {
  const system = useColorScheme();
  const [preference, setPref] = useState<ThemePreference>(DEFAULT);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then(v => {
        if (v === 'system' || v === 'light' || v === 'dark') {
          setPref(v);
        }
      })
      .catch(() => {});
  }, []);

  const setPreference = useCallback((p: ThemePreference) => {
    setPref(p);
    AsyncStorage.setItem(KEY, p).catch(() => {});
  }, []);

  const scheme: Scheme =
    preference === 'system' ? (system === 'light' ? 'light' : 'dark') : preference;

  // Swap the palette before any child renders with it.
  if (currentScheme() !== scheme) {
    applyScheme(scheme);
  }

  return (
    <ThemeContext.Provider value={{scheme, preference, setPreference}}>
      {children(scheme)}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
