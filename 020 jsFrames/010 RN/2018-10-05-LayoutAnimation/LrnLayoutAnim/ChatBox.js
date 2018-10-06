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

    constructor(props) {
        super(props);

        this.hasNewMsg = false;

        this.scrollViewRef = null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.messages.length === 0 || this.props.messages.length === 0) {
            return;
        }

        const prevLastestMsgId = prevProps.messages[prevProps.messages.length-1].id;
        const currLastestMsgId = this.props.messages[this.props.messages.length-1].id;

        if (currLastestMsgId > prevLastestMsgId) {
            this.hasNewMsg = true;
            setTimeout(() => {
                this.scrollViewRef.scrollToEnd({animated: true});
            }, 100);
        } else {
            this.hasNewMsg = false;
        }
    }

	render() {
		return (
            <View style={this.props.style}>
                <View style={styles.chatBox}>
                    <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    ref = {(comp) => { this.scrollViewRef = comp; }}
                    onContentSizeChange = {() => {
                        if (this.hasNewMsg) {
                            //this.scrollViewRef.scrollToEnd({animated: true});
                        }
                    }}
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
