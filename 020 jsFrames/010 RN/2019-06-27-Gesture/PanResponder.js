import React from 'react';
import { StyleSheet, Text, View, Animated, PanResponder } from 'react-native';
export default class PanResponderCircle extends React.Component {

    constructor() {
        super();

        this.state = {
            pan: new Animated.ValueXY(), // inits to zero
        };

        this.state.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, {
                dx: this.state.pan.x, // x,y are Animated.Value
                dy: this.state.pan.y,
            }], {
                    useNativeDriver: false,
                    listener: (event) => {
                        event.persist();
                        // console.info('Animated.event', event.nativeEvent.locationY);
                    }
                }),
            onPanResponderRelease: () => {
                Animated.spring(
                    this.state.pan,         // Auto-multiplexed
                    { toValue: { x: 0, y: 0 }, useNativeDriver: true },
                ).start();
            },
        });
    }

    render() {

        const animatiedStyles = {
            transform: [{
                scale: Animated.add(1, Animated.divide(this.state.pan.y, 100))
            }
            ]
        };

        console.info(animatiedStyles.transform);

        return (
            <View style={styles.container}>
                <Animated.View
                    {...this.state.panResponder.panHandlers}
                    style={[styles.circel, animatiedStyles]}
                />
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