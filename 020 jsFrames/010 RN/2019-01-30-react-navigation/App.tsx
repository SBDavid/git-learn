import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { createStackNavigator ,createTabNavigator, NavigationScreenProp } from 'react-navigation';

interface P {
	navigation: NavigationScreenProp<any>
}

class HomeScreen extends React.Component<P> {
	state={
		input: 'home'
	}

	render() {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Text>Home Screen</Text>
				<TextInput
				value={this.state.input}
				onChangeText={(text) => {
					this.setState(() => {
						return {
							input: text
						}
					})
				}}
				></TextInput>
				<Button
				onPress={() => {
					this.props.navigation.navigate('About');
					console.info('home')
				}}
				title={'Go To About'}
				></Button>
			</View>
		);
	}
}

class AboutScreen extends React.Component<P> {

	state={
		input: 'about'
	}

	render() {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Text>About Screen</Text>
				<TextInput
				value={this.state.input}
				onChangeText={(text) => {
					this.setState(() => {
						return {
							input: text
						}
					})
				}}
				></TextInput>
				<Button
				onPress={() => {
					this.props.navigation.navigate('Home');
					console.info('about')
				}}
				title={'Go Back'}
				></Button>
			</View>
		);
	}
}

const home = createStackNavigator({
	Home: HomeScreen,
})

export default createTabNavigator({
	Home: home,
	About: AboutScreen
},
{
	initialRouteName: 'Home',
	tabBarOptions: {
		showLabel: false,
		style: {
			height: 0
		}
	}
});
