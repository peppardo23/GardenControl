/**
 * @format
 */

import * as React from 'react';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';
import { Provider as PaperProvider } from 'react-native-paper';

export default function Main() {
    return (
      <PaperProvider>
        <App />
      </PaperProvider>
    );
  }
  
  AppRegistry.registerComponent(appName, () => Main);
  
