/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, WebView, Text} from 'react-native';

type AppProps = {};
export default class App extends Component<AppProps> {
	render() {
		return (
			<View
			style={styles.container}
			>
				<Text>WebView Container</Text>
				<WebView
					style={{
						flex: 1,
						backgroundColor: 'skyblue',
					}}
					javaScriptEnabled={true}
					onError={(err) => {
						console.info(err)
					}}
					onLoad={() => {
						console.info('onLoad')
					}}
					onMessage={(msg) => {
						msg.persist();
						console.info(msg);
					}}
					source={{uri: 'http://work.goodboydigital.com/runpixierun/'}}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'powderblue',
		width: '100%',
		height: '100%',
	},
});
