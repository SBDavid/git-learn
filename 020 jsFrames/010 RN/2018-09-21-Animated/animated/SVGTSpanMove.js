import React, { Component } from 'react';
import {StyleSheet, View, Button, Animated, Easing} from 'react-native';
import Svg, { Defs, Stop, LinearGradient, Text, TSpan } from 'react-native-svg'

export default class SVGTSpanMove extends React.PureComponent {
    constructor(props) {
        super(props);

        this.startLoadTime = new Date();
        this.animateTotalStartTime = null;
        this.amount = this.props.list.length || 100;

        this.currentStep = 0;

        this.state = {
            step: new Animated.Value(0),
            steps: [0],
        }
    }

    loadMore() {
        if (this.currentStep === 0) {
            this.animateTotalStartTime = new Date();
        }
        if (this.currentStep < this.amount-1) {
            
            const setStateTime = new Date();
            this.setState((state) => {
                const nextAmount = this.amount - this.currentStep > this.props.stepLength ? this.props.stepLength : this.amount - this.currentStep;
                const nextSteps = this.props.list.slice(this.currentStep, this.currentStep + nextAmount);
                this.currentStep += nextAmount;
                return {
                    steps: nextSteps
                }
            }, () => {
                console.warn('SVGTSpanSetStateTime', new Date() - setStateTime);
                this.run();
            })
        } else {
            console.warn('animateTotalStartTime', new Date()-this.animateTotalStartTime);
        }
    }

    componentDidMount() {
        console.warn('SVGTSpanMove componentDidMount', new Date() - this.startLoadTime);
    }

    componentWillUnmount() {
        Animated.timing(
            this.state.step
        ).stop();
    }
    
    run() {
        const eachRoundTime = +new Date();
        Animated.sequence(
            this.state.steps.map((step, idx) => Animated.timing(
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
                // console.warn('eachRoundTime', +new Date() - eachRoundTime);
                this.loadMore();
            }
        });
    }

    render() {
        const steps = this.state.steps.map((step, idx) => {
            return (
                <TSpan
                    key={idx}
                    x='0'
                    y={30 + idx * 40}
                >
                    {step}
                </TSpan>
            );
        });

        return (
            <View style={styles.container}>
                <Button title={'SVG TSpan'} onPress={() => {
                    this.currentStep = 0;
                    this.loadMore();
                }} />
                <View style={{
                    backgroundColor: '#f1f1f1',
                    height: 40,
                    width: 120,
                    overflow: 'hidden',
                }}>
                    <View
                        style={{
                            height: 40 * this.state.steps.length,
                            width: 120,
                        }}
                    >
                        <Animated.View
                            style={{
                                height: 40 * this.state.steps.length,
                                width: 120,
                                transform: [
                                    {
                                        translateY: this.state.step
                                    }
                                ]
                            }}
                        >
                            <Svg width='120' height={40 * this.state.steps.length}>
                                <Defs>
                                    <LinearGradient id='grad' x1='0' y1='0' x2={22 * ((this.amount + '').length + 1)} y2='0'>
                                        <Stop offset='0' stopColor='#DAAB00' stopOpacity='1' />
                                        <Stop offset='1' stopColor='#FDE71B' stopOpacity='1' />
                                    </LinearGradient>
                                </Defs>
                                <Text
                                width='120'
                                height={40 * this.state.steps.length}
                                fontFamily='Futura LT Book'
                                fill='url(#grad)'
                                fontSize='28'
                                >
                                    {steps}
                                </Text>
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