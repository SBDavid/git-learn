/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { PureComponent } from 'react';
import { StyleSheet, View, Dimensions, StatusBar } from 'react-native';
import { GameLoop, GameEngine } from "react-native-game-engine"
import { Finger } from "./Finger";
import { MoveFinger, LongPress } from "./systems"

export default class BestGameEver extends PureComponent {
	constructor() {
		super();
		this.state = {
			entities: {
				0: { position: [40, 200], renderer: <Finger /> },
				1: { position: [100, 200], renderer: <Finger /> }
			}
		}
	}

	render() {
		return (
			<GameEngine
				style={styles.container}
				systems={[MoveFinger]} //-- We can add as many systems as needed
				entities={this.state.entities}>

				<StatusBar hidden={true} />

			</GameEngine>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF"
	}
});
