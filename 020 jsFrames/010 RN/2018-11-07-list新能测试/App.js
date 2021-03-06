/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

// JS通过websocket连接

import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import Sender from './sender';

type AppProps = {};
export default class App extends Component<AppProps> {

	constructor() {
		super();
		this.state = {
			list: []
		}

		this.addText = this.addText.bind(this);
		this.sender = new Sender(200, (count) => {
			const item = {
				key: count,
				backgroundColor: count%2 === 0 ? 'powderblue' : 'skyblue'
			}

			this.addText(item);
		});
		this.startTime = +new Date();
	}

	componentDidMount() {
		try {
			this.sender.run(50);
		} catch (err) {
			console.info(err);
		}
		
	}

	addText(item) {
		this.setState((prevState) => {

			let newList = [...prevState.list, item];
			if (newList.length > 10000) {
				newList.splice(0, newList.length - 60);
			}

			return ({
				list: newList
			});
		});
	}

	render() {
		const startTime = +new Date();
		const ITEM_HEIGHT = 30;
		const jsx = (
			<View style={styles.container}>
				<FlatList
				style={styles.list}
				data={this.state.list}
				onScroll={() => {
					
				}}
				renderItem={
					({item}) => {
						return <Text
						style={{
							fontSize: 20,
							backgroundColor: item.backgroundColor,
							height: 30,
						}}
						key={item.key}
						getItemLayout={(data, index) => {
							return {length: 90, offset: 90 * index, index}
						}}
						onLayout={() => {
						}}
						>
						{item.key}
						
						</Text>
					}
				}
				>
				</FlatList>
			</View>
		);
		try {
		} catch(err) {

		}
		return jsx;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		backgroundColor: 'powderblue',
	},
	list: {
		width: '100%',
		height: '100%',
		backgroundColor: 'skyblue',
	},
	text: {
		fontSize: 20
	}
});
