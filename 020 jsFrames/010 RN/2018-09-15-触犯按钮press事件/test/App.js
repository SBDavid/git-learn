/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, NativeModules, UIManager, findNodeHandle } from 'react-native';

console.log('UIManager', UIManager);
console.log('NativeModules', NativeModules);

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  componentDidMount() {
    console.log(this._reactInternalFiber);

    /* let next = this._reactInternalFiber.child;

    while(next) {
      if (next.stateNode.setNativeProps) {
        console.info('setNativeProps')
      }
      next = next.child;
    }

    this._btn.setNativeProps({
      title: 'title'
    }); */

    const btnRef = findNodeHandle(this._btn);
    console.info('btnRef', btnRef);

    console.info('this._btn', this._btn);  
    
    this._btn._reactInternalFiber.child.stateNode.touchableHandlePress();

    UIManager.dispatchViewManagerCommand(
      btnRef,
      UIManager.RCTView.Commands.setPressed,
      [true],
    );
  }

  render() {
    return (
      <Button
        ref={component => this._btn = component}
        title={'Button'}
        onPress={() => {
          console.info('press');
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
