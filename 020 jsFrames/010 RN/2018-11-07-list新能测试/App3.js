/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

// scrollview

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import Sender from './sender';
import logger from 'websocket-log';

type AppProps = {};
export default class App extends Component<AppProps> {

	constructor() {
		super();
		this.state = {
			list: []
		}

		this.addText = this.addText.bind(this);
		this.sender = new Sender(50, (count) => {
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
			this.sender.run(100);
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
		
		const items = this.state.list.map((item) => {
			return <Text
					style={{
						fontSize: 20,
						backgroundColor: item.backgroundColor,
						height: 100,
					}}
					key={item.key}
					getItemLayout={(data, index) => {
						return {length: 90, offset: 90 * index, index}
					}}
					onLayout={() => {
						logger.log('item-layout');
					}}
					>
						{item.key}
					</Text>
		});

		const jsx = (
			<View style={styles.container}>
				<ScrollView
				showsVerticalScrollIndicator={false}
				style={styles.list}
				data={this.state.list}
				onScroll={(event) => {
					logger.log('ScrollView-onScroll');
				}}
				>
					{items}
				</ScrollView>
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
