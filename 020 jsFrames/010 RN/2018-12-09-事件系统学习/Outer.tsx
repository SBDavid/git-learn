import React, { PureComponent } from 'react';
import { View, ViewStyle } from 'react-native'

interface Props {
    style: any
}

export default class Outer extends PureComponent<Props> {
    render() {
        const {style, children} = this.props;

        return (
            <View
            style={style}
            onStartShouldSetResponder = {(evt) => {
                evt.persist();
                console.info('outer onStartShouldSetResponder');
                return true;
            }}
            onMoveShouldSetResponder = {(evt) => {
                evt.persist();
                console.info('outer onMoveShouldSetResponder');
                return true;
            }}
            onResponderGrant = {(evt) => {
                evt.persist();
                console.info('outer onResponderGrant');
            }}
            onResponderReject = {(evt) => {
                evt.persist();
                console.info('outer onResponderReject');
            }}
            onResponderMove = {(evt) => {
                evt.persist();
                console.info('inner onResponderMove');
            }}
            onResponderRelease = {(evt) => {
                evt.persist();
                console.info('outer onResponderRelease');
            }}
            onResponderTerminationRequest = {(evt) => {
                evt.persist();
                console.info('outer onResponderTerminationRequest');
                return true
            }}
            onResponderTerminate = {(evt) => {
                evt.persist();
                console.info('outer onResponderTerminate');
            }}
            >
            {children}
            </View>
        );
    }
}