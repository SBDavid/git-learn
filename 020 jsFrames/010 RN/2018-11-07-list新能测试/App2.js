/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

// java通过websocket连接

import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, DeviceEventEmitter } from 'react-native';

type AppProps = {};
export default class App extends Component<AppProps> {

	constructor() {
		super();
		this.state = {
			list: []
		}

		this.addText = this.addText.bind(this);
		this.startTime = +new Date();
		this.loger = new WebSocket('ws://192.168.72.199:3001');
		this.loger.onopen = () => {
			this.loger.send(`websocket open`)
		}
	}

	componentDidMount() {
		try {

			DeviceEventEmitter.addListener('testFlatList', (data) => {
				this.loger.send(`testFlatList ${+new Date()-this.startTime} ${data.key}`)
				this.startTime = +new Date();
				this.addText(data);
			})
		} catch (err) {
			console.info(err);
		}
		
	}

	addText(item) {
		this.setState((prevState) => {

			let newList = [...prevState.list, item];
			if (newList.length > 100000) {
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
				ref={(comp) => {
					this.flatList = comp;
				}}
				style={styles.list}
				data={this.state.list}
				onScroll={() => {
					this.loger.send(`onScroll... randon ${Math.random()}`);
				}}
				renderItem={
					({item}) => {
						return <Text
						style={{
							fontSize: 20,
							height: 30,
						}}
						key={item.key}
						getItemLayout={(data, index) => {
							this.loger.send(`getItemLayout`);
							return {length: 90, offset: 90 * index, index}
						}}
						onLayout={() => {
							this.loger.send(`onLayout randon ${Math.random()}`);
							// this.flatList.scrollToEnd();
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
			// this.loger.send(`render ${+new Date()-startTime}`);

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
