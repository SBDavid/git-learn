import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import styles from './style';

export default class App extends Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            title: 'Home',
            headerLeft: (
                <Button
                    onPress={() => navigation.navigate('Modal')}
                    title="Info"
                    color="#000"
                />
            )
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Home Page</Text>
                <Button
                    style={styles.welcome}
                    title={'Go to Details Screen. Id is Taylor.'}
                    onPress={() => { this.props.navigation.navigate('Details', { singer: 'Taylor' }) }}
                />
                <Button
                    style={styles.welcome}
                    title={'Go to Details Screen. Id is Avril.'}
                    onPress={() => { this.props.navigation.navigate('Details', { singer: 'Avril' }) }}
                />
            </View>
        );
    }
}