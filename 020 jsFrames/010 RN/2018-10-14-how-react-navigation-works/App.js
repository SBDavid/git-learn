/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import { createStackNavigator } from 'react-navigation';
import RouterNameScreen from './RouterNameScreen';

const StackRouter = createStackNavigator({
	Home: {
		screen: RouterNameScreen
	},
	Detail: {
		screen: RouterNameScreen
	},
});

type AppProps = {};
export default class App extends Component<AppProps> {


	render() {
		return (
			<StackRouter onNavigationStateChange={(preNav, nextNav, action) => {
				/* console.info('onNavigationStateChange');
				console.info('preNav', preNav);
				console.info('nextNav', nextNav);
				console.info('action', action); */
			}}/>
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
