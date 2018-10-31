/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import TestWebView from './TestWebView';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => TestWebView);
