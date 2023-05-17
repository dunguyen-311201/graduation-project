// import StorybookUIRoot from './.ondevice/Storybook';
import React, {useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

import {RootNavigation} from './navigation';
import {Context, ContextProps} from './context';
import {useAuth} from './hooks';

function App() {
  const [messages, setMessages] = useState<string[]>([]);

  const {currentUser} = useAuth();

  const isAuth = useMemo(
    () => currentUser?.displayName !== undefined,
    [currentUser?.displayName],
  );

  const [isAuthenticated, setIsAuthenticated] = useState(isAuth);

  const store: ContextProps = {
    isAuthenticated,
    onAuthenticated: setIsAuthenticated,
    muids: messages,
    addMessage: (uid: string) => {
      setMessages(prev => {
        if (!prev.includes(uid)) {
          return [...prev, uid];
        }
        return prev;
      });
    },
    removeMessage: (uid: string) => {
      setMessages(prev => {
        if (prev.includes(uid)) {
          return prev.filter(item => item !== uid);
        }
        return prev;
      });
    },
  };

  return (
    <Context.Provider value={store}>
      <SafeAreaView style={styles.container}>
        <RootNavigation />
      </SafeAreaView>
    </Context.Provider>
  );
}

export default App;

// export {StorybookUIRoot as default};

const styles = StyleSheet.create({
  container: {flex: 1},
});
