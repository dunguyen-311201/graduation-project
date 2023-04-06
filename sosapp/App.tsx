// import StorybookUIRoot from './.ondevice/Storybook';
import {SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';

import {RootNavigation} from '@navigation';
function App() {
  return (
    <SafeAreaView style={styles.container}>
      <RootNavigation />
    </SafeAreaView>
  );
}

export default App;

// export {StorybookUIRoot as default};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
