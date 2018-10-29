import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

class RouterNameScreen extends React.Component {
    render() {

        console.info('AnotherRouterNameScreen render');

        return(
            <View style={styles.container}>
                <Button 
                title={'push Detail'}
                onPress={() => {
                    this.props.navigation.push('Detail');
                }}
                />
                <Button 
                title={'push Home'}
                onPress={() => {
                    this.props.navigation.push('Home');
                }}
                />
            </View>
        );
    }
}


export default (props) => {
    console.info('AnotherRouterNameScreen', props);

    return <RouterNameScreen {...props}/>;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'powderblue',
	},
});