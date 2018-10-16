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
import { red } from 'ansi-colors';

type Props = {
    messages: []
};
export default class ChatBox extends Component<Props> {

    constructor(props) {
        super(props);

        this.hasNewMsg = false;

        this.scrollViewRef = null;
        this.chatBoxRef = null;
        this.viewRef = null;

        this._onResize = this._onResize.bind(this);
        this.containerH = 0;
        this.contentH = 0;
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

    _onResize() {
        if (this.contentH <= this.containerH) {
            console.info('_onResize', this.containerH);
            this.viewRef.setNativeProps({
                justifyContent: 'flex-start'
            });
            this.chatBoxRef.setNativeProps({
                height: this.containerH,
            });
        } else {
            this.viewRef.setNativeProps({
                justifyContent: 'flex-end'
            });
            this.chatBoxRef.setNativeProps({
                height: this.contentH,
            });
        }
    }

	render() {
		return (
            <View style={this.props.style}>
                <View 
                style={
                    {
                        justifyContent: 'flex-start',
                        height: '100%',
                        overflow: 'hidden',
                        borderStyle: 'solid',
                        borderWidth: 0
                    }
                }
                onLayout={(event) => {
                    console.info(event.nativeEvent);
                    this.containerH = event.nativeEvent.layout.height;
                    this._onResize();
                }}
                ref={(comp) => { this.viewRef = comp; }}
                >
                    <View
                    style={styles.chatBox}
                    ref = {(comp) => { this.chatBoxRef = comp; }}
                    >
                        <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.contentContainer}
                        ref = {(comp) => { this.scrollViewRef = comp; }}
                        onContentSizeChange = {(contentWidth, contentHeight) => {
                            console.info('onContentSizeChange',contentHeight);
                            this.contentH = contentHeight;
                            // this._onResize();
                        }}>
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
            </View>
		);
	}
}

const styles = StyleSheet.create({
    scrollView: {
        borderStyle: 'solid',
        borderWidth: 0,
    },
	chatBox: {
        padding: 5,
		width: '100%',
		height: 582,
        backgroundColor: '#F5FCFF',
	},
	contentContainer: {
        alignItems: 'flex-start',
	}
});
