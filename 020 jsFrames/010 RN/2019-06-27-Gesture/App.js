import React from 'react';
import { StyleSheet, Text, View, Animated, PanResponder } from 'react-native';
import PanResponderCircle from './PanResponder';
import GestureHandlerCircle from './GestureHandlerCircle';
import GestureHandlerBar from './GestureHandlerBar';

export default class App extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
    setTimeout(() => {
      // debugger
    }, 1000);
  }

  render() {

    return (
      <View style={styles.container}>
        <PanResponderCircle />
        <GestureHandlerCircle />
        <GestureHandlerBar />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circel: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
    borderRadius: 50
  }
});
