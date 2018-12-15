

import React, { Component } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import MessageList from './MessageList';

class ChatMsg extends Component {
	render() {
		return <Text style={{
			height: 50
		}}>111</Text>
	}
}

export default class App extends Component {

	constructor() {
		super();

		this.state = {
			msgs: [{
				type: 'chat',
				data: {

				},
				uniqueId: this.uniqueId++
			}]
		}

		this.uniqueId = 0;

		this.onNewMsgLayout = this.onNewMsgLayout.bind(this)
	}

	addMsg() {
		this.setState((state) => {
			return {
				msgs: [...this.state.msgs, {
					type: 'chat',
					data: {

					},
					uniqueId: this.uniqueId++
				}]
			}
		})
	}

	onNewMsgLayout(msg) {
		console.info('onNew')
		this.messageList.scrollToEnd()
	}

	render() {
		return (
			<View style={styles.container}>
				<View
				style={{
					height: 200,
					backgroundColor: 'skyblue',
					width: '100%'
				}}
				>
					<MessageList
					ref={(comp) => {this.messageList=comp}}
					msgs={this.state.msgs}
					/* onScrollBegin={this.onScrollBegin}
					onScrollEnd={this.onScrollEnd}
					onAttachBottom={this.onAttachBottom}
					onDettachBottom={this.onDettachBottom} */
					onNewMsgLayout={this.onNewMsgLayout}
					msgRenders = {{
					'chat': {
						'default': ChatMsg
					},
					}}
					/>
				</View>
				<Button
				style={{
					flex: 1,
					width: '100%'
				}}
				title='send'
				onPress={() => {
					this.addMsg()
				}}
				/>
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
});
