import React, { PureComponent } from 'react';
import { View, ViewStyle } from 'react-native'

interface Props {
    style: any
}

export default class Inner extends PureComponent<Props> {
    render() {
        const {style} = this.props;

        return (
            <View
            style={style}
            onStartShouldSetResponder = {(evt) => {
                evt.persist();
                console.info('inner onStartShouldSetResponder');
                return true;
            }}
            onMoveShouldSetResponder = {(evt) => {
                evt.persist();
                console.info('inner onMoveShouldSetResponder');
                return true;
            }}
            onResponderGrant = {(evt) => {
                evt.persist();
                console.info('inner onResponderGrant');
            }}
            onResponderReject = {(evt) => {
                evt.persist();
                console.info('inner onResponderReject');
            }}
            onResponderMove = {(evt) => {
                evt.persist();
                console.info('inner onResponderMove');
            }}
            onResponderRelease = {(evt) => {
                evt.persist();
                console.info('inner onResponderRelease');
            }}
            onResponderTerminationRequest = {(evt) => {
                evt.persist();
                console.info('inner onResponderTerminationRequest');
                return false
            }}
            onResponderTerminate = {(evt) => {
                evt.persist();
                console.info('inner onResponderTerminate');
            }}
            ></View>
        );
    }
}