/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ImageBackground} from 'react-native';

type MessageProps = {
	text: String
};
export default class Message extends Component<MessageProps> {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<View style={styles.container}>
                <ImageBackground style={styles.textBg}>
                    <Text style={styles.text}>{this.props.text}</Text>
                </ImageBackground>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
        padding: 5,
    },
    textBg: {
        borderRadius: 2,
		backgroundColor: '#86ea36',
    },
    text: {
        padding: 5,
        fontSize: 20,
    }
});