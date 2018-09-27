import React, { Component } from 'react';
import {StyleSheet, View, Button, Animated, Text} from 'react-native';


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
        console.warn('Text componentDidMount', new Date() - this.startLoadTime);
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
                key={idx}
                style={{
                    width:120,
                    height:40,
                    fontSize: 28,
                    fontFamily:'Futura LT Book'
                }}
                >
                    {step}
                </Text>
            );
        });

        return (
            <View style={styles.container}>
                <Button title={'Text'} onPress={() => {
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
                            {steps}
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