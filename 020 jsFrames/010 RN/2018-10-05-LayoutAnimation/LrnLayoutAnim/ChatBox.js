/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';

import Message from './Message';

type Props = {
    messages: []
};
export default class ChatBox extends Component<Props> {

	render() {
		return (
            <View style={this.props.style}>
                <View style={styles.chatBox}>
                    <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    >
                        {
                            this.props.messages.map((val, idx) => {
                                return (
                                    <Message key={val.id} text={val.text}/>
                                );
                            })
                        }
                    </ScrollView>
                </View>
            </View>
		);
	}
}

const styles = StyleSheet.create({
	chatBox: {
        padding: 5,
		width: '100%',
		height: '100%',
        backgroundColor: '#F5FCFF',
	},
	contentContainer: {
		alignItems: 'flex-start',
	}
});
