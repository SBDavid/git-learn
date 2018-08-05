/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React from 'react';
import { createStackNavigator } from 'react-navigation'; 
import home from './home';
import detailsScreen from './DetailsScreen';
import modalScreen from './ModalScreen';
import ModalScreen from './ModalScreen';

const MainStack = createStackNavigator({
  Home: home,
  Details: detailsScreen
},
{
  initialRouteName: 'Home',
  mode: 'modal',
  // headerMode: 'none',
});

const RootStack = createStackNavigator({
  Root: MainStack,
  Modal: ModalScreen
}, {
  mode: 'modal',
  headerMode: 'none',
});

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}