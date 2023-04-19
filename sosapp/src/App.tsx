// import StorybookUIRoot from './.ondevice/Storybook';
import React from 'react';
import {StyleSheet} from 'react-native';
import 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

import {RootNavigation} from './navigation';
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

const styles = StyleSheet.create({container: {flex: 1}});
