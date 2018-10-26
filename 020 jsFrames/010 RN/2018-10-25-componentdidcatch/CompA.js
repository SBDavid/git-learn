import React from 'react';
import { View, Text, Button, TouchableHighlight } from 'react-native';

export default class CompA extends React.PureComponent {

    componentDidUpdate() {
        // throw Error('error in didupdate');
    }



    render() {

        return(
            <View
            style={{padding: 50}}
            >
                <TouchableHighlight
                onPress={() => {
                    throw Error('error in onPress');
                }}>

                    <Text>Trigger error in onPress</Text>
                </TouchableHighlight>
                <TouchableHighlight
                onPress={() => {
                    const p = new Promise((res, rej) => {
                        // throw Error('error in Promise');
                        rej({
                            myMsg: 'whatever'
                        });
                        res('1212');
                    });
                    p.then((reslut) => {
                        console.info('promise is resolved')
                    })
                    /* .catch((err) => {
                        console.info('catch in promise.catch')
                    }); */
                }}>

                    <Text>Trigger error in promise</Text>
                </TouchableHighlight>
            </View>
        );
    }
}