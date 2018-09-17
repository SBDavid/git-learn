import { Animated, Text } from 'react-native';

import React from 'react';

class AnimatedView extends React.Component {
    state = {
        fadeAnim: new Animated.Value(0.5)
    }

    componentWillMount() {
        this.rotate = this.state.fadeAnim.interpolate({
            inputRange: [0.5, 1],
            outputRange: ['4800deg', '0deg']
        });
    }

    componentDidMount() {
        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
                toValue: 1,                   // Animate to opacity: 1 (opaque)
                duration: 30000,              // Make it take a while
                useNativeDriver: true
            }
        ).start();
    }

    render() {
        let { fadeAnim } = this.state;

        return (
            <Animated.View
                style={{
                    ...this.props.style,
                    opacity: fadeAnim,         // Bind opacity to animated value
                    transform: [
                        {rotate: this.rotate},
                    ]
                }}
            >
                <Text style={{fontSize: 40}}>AnimatedView</Text>
            </Animated.View>
        );
    }
}

export default AnimatedView;