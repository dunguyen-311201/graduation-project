// import StorybookUIRoot from './.ondevice/Storybook';
import {SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import 'react-native-gesture-handler';

import {RootNavigation} from '@navigation';
import {ContextProvider} from './context';

function App() {
  return (
    <ContextProvider>
      <SafeAreaView style={styles.container}>
        <RootNavigation />
      </SafeAreaView>
    </ContextProvider>
  );
}

export default App;

// export {StorybookUIRoot as default};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
