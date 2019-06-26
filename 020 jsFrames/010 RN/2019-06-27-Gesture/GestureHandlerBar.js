import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';

export default class GestureHandlerBar extends React.Component {
    constructor() {
        super();

        this._tilt = new Animated.Value(0);
        this._tilt.setOffset(400);
        this._tiltI = this._tilt.interpolate({
            inputRange: [-1, 0, 400, 401],
            outputRange: [0, 0, 1, 1],
        });

        this.tx = this._tilt.interpolate({
            inputRange: [-1, 0, 400, 401],
            outputRange: [-200, -200, 0, 0]
        });

        this._lastTilt = 400;
        this._onTiltGestureEvent = Animated.event(
            [{ nativeEvent: { translationX: this._tilt } }],
            { useNativeDriver: true }
        )

        console.info(this._onTiltGestureEvent)
    }

    _onTiltGestureStateChange = (event) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            this._lastTilt += event.nativeEvent.translationX;
            if (this._lastTilt < 0) {
                this._lastTilt = 0;
            } else if (this._lastTilt > 400) {
                this._lastTilt = 400;
            }
            this._tilt.setOffset(this._lastTilt);
            this._tilt.setValue(0);
        }
    };

    render() {

        const animatiedStyles = {
            transform: [{
                scaleX: this._tiltI
            }
            ]
        };

        const animatiedStylesMove = {
            transform: [{translateX: this.tx}
            ]
        };

        return(
            <PanGestureHandler
            onGestureEvent={this._onTiltGestureEvent}
            onHandlerStateChange={this._onTiltGestureStateChange}>
                <Animated.View style={styles.container}>
                    <View style={styles.barContainer}>
                        <Animated.View style={[styles.barMove, animatiedStylesMove]}>
                            <Animated.View
                                style={[styles.bar, animatiedStyles]}
                            />
                        </Animated.View>
                    </View>
                </Animated.View>
            </PanGestureHandler>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    
    barContainer: {
        backgroundColor: '#a1a1a1',
        width: 400,
        height: 50,
    },

    barMove: {
        width: 400,
        height: 50,
    },

    bar: {
        position: 'absolute',
        backgroundColor: 'red',
        width: 400,
        height: 50
    }
});