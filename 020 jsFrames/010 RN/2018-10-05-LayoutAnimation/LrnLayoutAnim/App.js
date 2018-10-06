/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import ChatBox from './ChatBox';
import InputBox from './InputBox';

type AppProps = {};
export default class App extends Component<AppProps> {

	constructor(props) {
		super(props);

		this.messageIdCount = 0;

		this.state = {
			messages: [
				/* {
					id: 0,
					user: 'me',
					text: 'hello world'
				} */
			]
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<ChatBox
				style={styles.chatBox}
				messages={this.state.messages}
				></ChatBox>
				<InputBox
				style={styles.InputBox}
				onSubmitEditing={(text) => {
					this.setState((state) => {
						const newMessages = Object.assign([], state.messages);
						const newMessage = {
							id: this.messageIdCount++,
							user: 'me',
							text
						}
						newMessages.push(newMessage);
						return {
							messages: newMessages
						}
					})
				}}
				></InputBox>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		backgroundColor: 'powderblue',
	},
	chatBox: {
		flex: 1,
		width: '100%',
	},
	InputBox: {
		flex: 0,
        height: 50,
		width: '100%',
	}
});
