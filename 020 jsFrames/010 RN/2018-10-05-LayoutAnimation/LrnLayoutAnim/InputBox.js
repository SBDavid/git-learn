/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, TextInput, Text, View, Button, TouchableNativeFeedback,TouchableHighlight, ImageBackground } from 'react-native';

type Props = {
};
export default class InputBox extends Component<Props> {
	constructor(props) {
        super(props);

        this.state = {
            text: ''
        }

        this.onSubmit = this.onSubmit.bind(this);
	}

    onSubmit() {
        if (this.state.state === '') {
            return;
        }
        this.props.onSubmitEditing(this.state.text);
    }

	render() {
		return(
			<View style={this.props.style}>
                <View style={styles.container}>
                    <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({text})}
                    onSubmitEditing={this.onSubmit}
                    />
                    <View style={{marginLeft: 5}}>
                        <TouchableHighlight
                        style={styles.button}
                        onPress={this.onSubmit}
                        >
                            <ImageBackground style={styles.textBg}>
                                <Text style={styles.text}>发送</Text>
                            </ImageBackground>
                        </TouchableHighlight>
                    </View>
                </View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
        height: '100%',
        backgroundColor: '#f1f1f1',
        flex: 1,
        // 横向排列
        flexDirection: 'row',
        // 交叉轴对其方式
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 20,
    },
    button: {
    },
    textBg: {
        borderRadius: 2,
        backgroundColor: '#51a838',
        borderColor: '#4c873f',
        borderWidth: 1,
        elevation: 1,
    },
    text: {
        fontSize: 20,
        padding: 5,
        color: '#fff',
    }
});