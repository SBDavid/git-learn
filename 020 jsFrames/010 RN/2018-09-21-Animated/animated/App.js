/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, Button, Animated} from 'react-native';
import SVGTextMove from './SVGTextMove';
import SVGTSpanMove from './SVGTSpanMove';
import TextMove from './TextMove';

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <SVGTextMove amount={1000} duration={0} useNativeDriver={true}/>
        <SVGTSpanMove amount={1000} duration={0} useNativeDriver={true}/>
        <TextMove amount={1000} duration={0} delay={0} useNativeDriver={true}/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'flex-start',
    backgroundColor: '#F5FCFF',
  }
});
