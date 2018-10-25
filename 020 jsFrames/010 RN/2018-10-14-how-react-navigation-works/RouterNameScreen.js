import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

/* export default class RouterNameScreen extends React.Component {
    render() {

        console.info('RouterNameScreen render');

        return(
            <View style={styles.container}>
                <Text>{this.props.navigation.state.routeName}</Text>
                <Button 
                title={'push'}
                onPress={() => {
                    this.props.navigation.push('Detail');
                }}
                />
            </View>
        );
    }
} */


export default (props) => {
    console.info('RouterNameScreen render');

        return(
            <View style={styles.container}>
                <Text>{props.navigation.state.routeName}</Text>
                <Button 
                title={'push'}
                onPress={() => {
                    props.navigation.push('Detail');
                }}
                />
            </View>
        );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'powderblue',
	},
});