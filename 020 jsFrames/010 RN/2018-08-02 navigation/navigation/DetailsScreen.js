import React from 'react';
import { View, Text, Button } from 'react-native';
import styles from './style';

export default class DetailsScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return ({
            title: 'Detail: ' + navigation.getParam('singer', 'nobody')
        })
    }
    render() {

        const name = this.props.navigation.getParam('singer', 'nobody');

        return(
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>DetailsScreen Id is {name}</Text>
                <Button
                    style={styles.welcome}
                    title={'Go Back!'}
                    onPress={() => {this.props.navigation.goBack()}}
                 />
                 <Button
                    style={styles.welcome}
                    title={'Push Details!'}
                    onPress={() => {this.props.navigation.push('Details', {singer: 'Avril'})}}
                 />
                 <Button
                    style={styles.welcome}
                    title="Update the title"
                    onPress={() => this.props.navigation.setParams({singer: 'Updated!'})}
                />
            </View>
        );
    }
}