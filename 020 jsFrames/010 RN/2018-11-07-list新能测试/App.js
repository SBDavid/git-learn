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

		this.wc = new WebSocket('ws://192.168.72.199:3000');
	}

	componentDidMount() {
		try {

			this.wc.onopen = () => {
				console.log('websocket open');
			}

			this.wc.onclose = function(){
				console.log('websocket close');
			}

			this.wc.onmessage = (ev) => {
				const data = JSON.parse(ev.data);
				//console.warn('onmessage', +new Date()-this.startTime, data.key);
				this.loger.send(`onmessage ${+new Date()-this.startTime} ${data.key}`)
				this.startTime = +new Date();
				this.addText(data);
			}
		} catch (err) {
			console.info(err);
		}
		
	}

	addText(item) {
		this.setState((prevState) => {

			let newList = [...prevState.list, item];
			if (newList.length > 100) {
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
					this.loger.send(`onScroll... randon ${Math.random()}`);
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
							this.loger.send(`getItemLayout`);
							return {length: 90, offset: 90 * index, index}
						}}
						onLayout={() => {
							this.loger.send(`onLayout randon ${Math.random()}`);
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
