/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import CompA from './CompA';

type AppProps = {};
export default class App extends Component<AppProps> {

	constructor(props) {
        super(props);
        this.state = {
            height: 100
        }
    }

    componentDidMount() {
        this.setState({
            height: 101
        })
    }

    /* static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		console.info('getDerivedStateFromError', error);
        return { height: 200 };
    }

	componentDidCatch(error, info) {
		console.info('App', error, info)
	} */

	render() {
		return (
			<View style={styles.container}>
				<CompA height={this.state.height}></CompA>
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
		width: '100%',
		height: '100%',
	},
});
