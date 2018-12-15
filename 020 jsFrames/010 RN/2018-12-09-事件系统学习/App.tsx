import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Outer from './Outer'
import Inner from './Inner'

export default class App extends Component {

	render() {
		return (
			<View style={styles.container}>
				<Outer
				style={styles.outer}
				>
					<Inner style={styles.inner}/>
				</Outer>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'powderblue',
	},
	outer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: 300,
		height: 300,
		backgroundColor: 'skyblue',
	},
	inner: {
		display: 'flex',
		width: 100,
		height: 100,
		backgroundColor: 'steelblue',
	}
});
