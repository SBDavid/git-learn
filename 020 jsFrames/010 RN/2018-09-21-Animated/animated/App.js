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
import TextMove from './Text2Move';
import TextGradientMove from './TextGradientMove';

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
  }

  render() {

    const steps = [];
    for (let i = 0; i < 300; i++) {
      steps.push(i);
    }

    return (
      <View style={styles.container}>
        <SVGTextMove amount={300} duration={0} useNativeDriver={true}/>
        <SVGTSpanMove list={steps} stepLength={10} delay={0} duration={0} useNativeDriver={true}/>
        <TextMove list={steps} stepLength={10} delay={0} duration={0} useNativeDriver={true}/>
        <TextGradientMove list={steps} stepLength={10} delay={0} duration={0} useNativeDriver={true}/>
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
