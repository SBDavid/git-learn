/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Button, WebView } from 'react-native';
import Canvas from 'react-native-canvas';
import Circle from './Circle';

type AppProps = {};
export default class App extends Component<AppProps> {

	constructor() {
		super();
		// 画布
		this.ctx = null;
		this.canvas = null;
		// 获取屏幕尺寸
		this.windowH = Dimensions.get('window').height;
		this.windowW = Dimensions.get('window').width;
		console.info('Dimensions', Dimensions.get('window'));
		// 移动对象
		this.circle = new Circle(this.windowW/2, this.windowW/2, 'steelblue', 20);
		// 是否在run
		this.isRunning = true;


		this.gameLoop = this.gameLoop.bind(this);
		this.drawWorld = this.drawWorld.bind(this);
		this.clearWorld = this.clearWorld.bind(this);
		this.drawCircle = this.drawCircle.bind(this);
		this.drawCircles = this.drawCircles.bind(this);
		this.onTouchStart = this.onTouchStart.bind(this);
		this.onTouchMove = this.onTouchMove.bind(this);
	}

	componentDidMount() {
		// 初始化舞台
		this.canvas.width = this.windowW;
		this.canvas.height = this.windowH;
		this.ctx = this.canvas.getContext('2d');
		this.ctx.fillStyle = 'powderblue';
		this.ctx.fillRect(0, 0, this.windowW, this.windowW);
		// 开始游戏
		this.gameLoop();
	}

	drawCircle(circle) {
		this.ctx.globalAlpha = 1;
		this.ctx.fillStyle = circle.color;
		this.ctx.beginPath();
		this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
		this.ctx.fill();
	}

	drawCircles() {
		for (let i=20; i>0; i--) {
			this.circle.radius = i;
			if (i%2 == 0) {
				this.circle.color = 'powderblue';
			} else {
				this.circle.color = 'skyblue';
			}
			this.drawCircle(this.circle);
		}
	}

	clearWorld() {
		this.ctx.fillStyle = 'powderblue';
		this.ctx.globalAlpha = 0.1;
		this.ctx.fillRect(0, 0, this.windowW, this.windowW);
	}

	drawWorld(time) {
		this.clearWorld();
		this.drawCircles(this.circle);

		this.gameLoop();
	}

	gameLoop() {
		if (this.isRunning) {
			requestAnimationFrame(this.drawWorld);
		}
	}

	onTouchStart(event) {
		
	}

	onTouchMove(event) {
		const touch = event.nativeEvent;
		this.circle.x = touch.locationX;
		this.circle.y = touch.locationY;
	}

	render() {
		return (
			<View>
				<View
				style={{
					width: this.windowW,
					height: this.windowW
				}}
				onTouchMove={this.onTouchMove}
				onMoveShouldSetResponder={(evt) => true}
				>
					<Canvas
					ref={(comp) => {this.canvas = comp}} />
				</View>
				{/* <Button
				title={'end GameLoop'}
				onPress={() => { this.isRunning = false; }}
				 /> */}

				<WebView
				source={{uri: 'http://192.168.72.199:9000/webpack-dev-server/'}}
				style={{
					width: 300,
					height: 300
				}}
				/>
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
	},
});
