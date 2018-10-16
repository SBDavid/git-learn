/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {UIManager, Platform, Text, LayoutAnimation} from 'react-native';

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
				},
				{
					id: 1,
					user: 'me',
					text: 'hello world'
				},
				{
					id: 2,
					user: 'me',
					text: 'hello world'
				},
				{
					id: 3,
					user: 'me',
					text: 'hello world'
				},
				{
					id: 4,
					user: 'me',
					text: 'hello world'
				},
				{
					id: 5,
					user: 'me',
					text: 'hello world'
				},
				{
					id: 6,
					user: 'me',
					text: 'hello world'
				},
				{
					id: 7,
					user: 'me',
					text: 'hello world'
				},
				{
					id: 8,
					user: 'me',
					text: 'hello world'
				},
				{
					id: 9,
					user: 'me',
					text: 'hello world'
				},
				{
					id: 10,
					user: 'me',
					text: 'hello worldhello worldhello worldhello worldhello worldhello worldhello worldhello world'
				} */
			]
		};

		if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>Chat Room</Text>
				<ChatBox
				style={styles.chatBox}
				messages={this.state.messages}
				></ChatBox>
				<InputBox
				style={styles.InputBox}
				onSubmitEditing={(text) => {
					LayoutAnimation.configureNext({
						duration: 400, //持续时间
						create: { // 视图创建
							type: LayoutAnimation.Types.spring,
							property: LayoutAnimation.Properties.opacity,// opacity、scaleXY
						},
						update: { // 视图更新
							type: LayoutAnimation.Types.spring,
							property: LayoutAnimation.Properties.opacity,
						},
						delete: {
							type: LayoutAnimation.Types.linear,
							property: LayoutAnimation.Properties.opacity,
						}
					});
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
					});
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
		backgroundColor: '#F5FCFF',
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
