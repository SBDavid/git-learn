import React, { Component } from 'react';
import {StyleSheet, View, Button, Animated, Easing} from 'react-native';
import { LinearTextGradient } from 'react-native-text-gradient';

export default class TextGradientMove extends React.PureComponent {
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
                console.warn('TextGradientSetStateTime', new Date() - setStateTime);
                this.run();
            })
        } else {
            console.warn('animateTotalStartTime', new Date()-this.animateTotalStartTime);
        }
    }

    componentDidMount() {
        console.warn('TextGradientMove componentDidMount', new Date() - this.startLoadTime);
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
            return(
                <LinearTextGradient
                key={idx}
                style={{
                    height: 40,
                    fontSize: 28,
                    fontFamily: 'Futura LT Book',

                    }}
                locations={[0, 1]}
                colors={['#DAAB00', '#FDE71B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                >
                {step}
                </LinearTextGradient>
            );
        });

        return (
            <View style={styles.container}>
                <Button title={'SVG TextGradient'} onPress={() => {
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