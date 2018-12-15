import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';


export default class App extends Component {

	render() {
		return (
			<View style={styles.container}>
				<ScrollView
				style={styles.sv}
				horizontal={true}
				>
					<TouchableOpacity
					style={styles.to}
					onPress={() => {
						console.info(11)
					}}
					>
						<View style={styles.v}>
							<Text>TouchableOpacity</Text>
						</View>
					</TouchableOpacity>
					
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 0,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		backgroundColor: 'powderblue',
		height: 100,
	},
	sv: {
		backgroundColor: 'skyblue',
		height: 100,
		width: '100%'
	},
	to: {
		backgroundColor: 'steelblue',
		height: 100,
		width: 300
	},
	v: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 100
	}
});
