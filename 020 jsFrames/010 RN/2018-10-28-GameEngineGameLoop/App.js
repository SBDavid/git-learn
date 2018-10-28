/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { PureComponent } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { GameLoop } from "react-native-game-engine"

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const RADIUS = 25;

type AppProps = {};
export default class BestGameEver extends PureComponent<AppProps> {

	constructor() {
		super();
		this.state = {
			x: WIDTH / 2 - RADIUS,
			y: HEIGHT / 2 - RADIUS
		};

		this.updateHandler = this.updateHandler.bind(this);
	}

	updateHandler({ touches, screen, time }) {
		if (touches.length > 0) {
			console.info(touches, screen, time)
		}
		let move = touches.find(x => x.type === "move");
		if (move) {
			this.setState({
				x: this.state.x + move.delta.pageX,
				y: this.state.y + move.delta.pageY
			});
		}
	}

	render() {
		return (
			<GameLoop style={styles.container} onUpdate={this.updateHandler}>
				<View style={[styles.player, { left: this.state.x, top: this.state.y }]} />
			</GameLoop>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF"
	},
	player: {
		position: "absolute",
		backgroundColor: "pink",
		width: RADIUS * 2,
		height: RADIUS * 2,
		borderRadius: RADIUS * 2
	}
});