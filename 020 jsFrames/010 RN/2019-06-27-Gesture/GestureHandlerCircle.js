import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';

export default class GestureHandlerCircle extends React.Component {

    constructor() {
        super();

        this.state = {
            pan: new Animated.ValueXY(), // inits to zero
            barOld: new Animated.Value(0)
        };

        this.state._onPanGestureEvent = Animated.event([{nativeEvent: {
            translationX: this.state.pan.x,
            translationY: this.state.pan.y,
        }}], {
            useNativeDriver: true,
            listener: (event) => {
                event.persist();
                // console.info('Animated.event', event.nativeEvent.translationY);
            }
        });

        this.onHandlerStateChange = this.onHandlerStateChange.bind(this);
    }

    onHandlerStateChange(event) {
        if (event.nativeEvent.state === State.ACTIVE) {
            console.info('State.ACTIVE')
        } else if (event.nativeEvent.state === State.BEGAN) {
            console.info('State.BEGAN')
        } else if (event.nativeEvent.state === State.CANCELLED) {
            console.info('State.CANCELLED')
        } else if (event.nativeEvent.state === State.END) {
            console.info('State.END')
            Animated.spring(
                this.state.pan,         // Auto-multiplexed
                { toValue: { x: 0, y: 0 }, useNativeDriver: true },
            ).start();
        } else if (event.nativeEvent.state === State.FAILED) {
            console.info('State.FAILED')
        } else if (event.nativeEvent.state === State.UNDETERMINED) {
            console.info('State.UNDETERMINED')
        } 
        // console.info('onHandlerStateChange', event.nativeEvent.translationY);
    }

    onHandlerStateChangeBar(event) {
        if (event.nativeEvent.state === State.END) {
            this.state.barOld.setValue(event.nativeEvent.translationX);
            this.state.pan.x.setValue(0);
        }
    }

    render() {

        const animatiedStyles = {
            transform: [{
                scale: Animated.add(1, Animated.multiply(1, Animated.divide(Animated.subtract(0, this.state.pan.y), 100)) )
            }
            ]
        };

        console.info('GestureHandlerCircle', animatiedStyles);

        return(
        <View style={styles.container}>
            <PanGestureHandler
            onGestureEvent={this.state._onPanGestureEvent}
            onHandlerStateChange={this.onHandlerStateChange}
            shouldCancelWhenOutside={false}
            >
                <Animated.View
                    style={[styles.circel, animatiedStyles]}
                />
            </PanGestureHandler>
            
        </View>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    circel: {
        width: 100,
        height: 100,
        backgroundColor: 'red',
        borderRadius: 50
    }
});