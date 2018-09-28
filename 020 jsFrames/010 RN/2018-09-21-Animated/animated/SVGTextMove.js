import React, { Component } from 'react';
import {StyleSheet, View, Button, Animated} from 'react-native';
import Svg, { Defs, Stop, LinearGradient, Text } from 'react-native-svg'


export default class SVGTextMove extends React.PureComponent {
    constructor(props) {
        super(props);

        this.startLoadTime = new Date();
        this.amount = this.props.amount || 100;

        this.steps = [];
        for (let i = 0; i < this.amount; i++) {
            this.steps.push(i);
        }

        this.state = {
            step: new Animated.Value(0),
        }
    }

    componentDidMount() {
        console.warn('SVGTextMove componentDidMount', new Date() - this.startLoadTime);
    }

    componentWillUnmount() {
        Animated.timing(
            this.state.step
        ).stop();
    }

    run() {
        const startRunTime = +new Date();
        Animated.sequence(
            this.steps.map((step, idx) => Animated.timing(
                this.state.step,
                {
                    toValue: (idx) * (-40),
                    easing: function() {return 1;},
                    delay: this.props.delay || 0,
                    duration: this.props.duration || 16,
                    useNativeDriver: this.props.useNativeDriver || true,
                })
            )
        ).start((endRes) => {
            if (endRes.finished) {
                console.warn('startRunTime', +new Date() - startRunTime);
            }
        });
    }

    render() {
        const steps = this.steps.map((step, idx) => {
            return (
                <Text
                    fontFamily='Futura LT Book'
                    fill='url(#grad)'
                    key={idx}
                    fontSize='28'
                    x='0'
                    y={30 + idx * 40}
                >
                    {step}
                </Text>
            );
        });

        return (
            <View style={styles.container}>
                <Button title={'SVG Text'} onPress={() => {
                    this.run();
                }} />
                <View style={{
                    backgroundColor: '#f1f1f1',
                    height: 40,
                    width: 120,
                    overflow: 'hidden',
                }}>
                    <View
                        style={{
                            height: 40 * this.steps.length,
                            width: 120,
                        }}
                    >
                        <Animated.View
                            style={{
                                height: 40 * this.steps.length,
                                width: 120,
                                transform: [
                                    {
                                        translateY: this.state.step
                                    }
                                ]
                            }}
                        >
                            <Svg width='120' height={40 * this.steps.length}>
                                <Defs>
                                    <LinearGradient id='grad' x1='0' y1='0' x2={22 * ((this.amount + '').length + 1)} y2='0'>
                                        <Stop offset='0' stopColor='#DAAB00' stopOpacity='1' />
                                        <Stop offset='1' stopColor='#FDE71B' stopOpacity='1' />
                                    </LinearGradient>
                                </Defs>
                                {steps}
                            </Svg>
                        </Animated.View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      
    }
  });