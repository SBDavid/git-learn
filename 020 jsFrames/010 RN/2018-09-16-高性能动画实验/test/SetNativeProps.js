import React from 'react';
import { Text, View } from 'react-native';

class SetNativeProps extends React.Component {

    constructor(props) {
        super(props);

        this.viewRef = null;
        this.startTime = 0;

        this.opacity = 0.5;
        this.rotate = 0;
    }

    componentDidMount() {
        const startTime = +new Date();
        this.myAnimate(startTime);
    }

    myAnimate(startTime) {
        requestAnimationFrame((time) => {
            let timeRemain = 30000 - (+new Date() - startTime);
            if (timeRemain < 0) {
                timeRemain = 0;
            }
            
            const opacity = 1.5 - timeRemain / 30000;
            const rotate = 4800 * (1 - timeRemain / 30000);
            this.viewRef.setNativeProps({
                style: {
                    opacity: opacity,
                    transform: [
                        {rotate: String(rotate)+'deg'}
                    ]
                }
            });



            if (timeRemain >= 0) {
                this.myAnimate(startTime);
            }
        });
    }

    render() {
        return(
            <View ref={(component => {this.viewRef = component})}>
                <Text style={{fontSize:40}}>SetNativeProps</Text>
            </View>
        );
    }
}

export default SetNativeProps;