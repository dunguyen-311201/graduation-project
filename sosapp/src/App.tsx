// import StorybookUIRoot from './.ondevice/Storybook';
import React from 'react';
import 'react-native-gesture-handler';

import {ContextProvider} from './context';

function App() {
  console.log('run application!');

  return <ContextProvider />;
}

export default App;

// export {StorybookUIRoot as default};
