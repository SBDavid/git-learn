/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Animated} from 'react-native';
import { hidden } from 'ansi-colors';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);

    this.steps = [];
    for (let i=1; i<=200; i++) {
      this.steps.push(i);
    }

    this.state = {
      step: new Animated.Value(0),
      stepB: 0
    }
  }

  componentDidMount() {

    
    
  }

  run() {
    Animated.sequence(
      this.steps.map(step => Animated.timing(
        this.state.step,
        {
          toValue: (step-1)*(-50),
          delay: 8,
          duration: 0,
          useNativeDriver: true
        })
        )
    ).start();

    const timer = setInterval(() => {
      this.setState((state) => {
        return {
          stepB: state.stepB + 1
        }
      },
      () => {
        if (this.state.stepB === 200) {
          clearInterval(timer);
        }
      });
    }, 8);
  }

  render() {

    const steps = this.steps.map(c => {
      return (
        <Text style={styles.num}>{c}</Text>
      );
    });

    return (
      <View style={styles.container}>
        <Button title={'run'} onPress={() => {
          this.run();
        }} />
        <View style={{
          backgroundColor: '#f1f1f1',
          height: 50,
          weight: 50,
          overflow: 'hidden',
        }}>
          <Animated.View              
            style={{
              flex: 1,
              transform: [
                {
                  translateY: this.state.step
                }
              ]
            }}
          >
            {steps}
          </Animated.View>
        </View>
        <Text style={styles.num}>{this.state.stepB}</Text>
      </View>
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
  num: {
    height: 50,
    fontSize: 40,
    margin: 0
  }
});
