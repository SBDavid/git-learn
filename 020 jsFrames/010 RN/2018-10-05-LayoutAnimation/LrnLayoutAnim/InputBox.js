/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet, TextInput, Text,
    View, TouchableHighlight, ImageBackground,
    LayoutAnimation, Platform
} from 'react-native';
import {UIManager} from 'react-native';

type Props = {
};
export default class InputBox extends Component<Props> {
    constructor(props) {
        super(props);

        this.state = {
            text: ''
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onTextChange = this.onTextChange.bind(this);

        this.inputTextRef = null;

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    onSubmit() {
        if (this.state.state === '') {
            return;
        }
        this.props.onSubmitEditing(this.state.text);
        // 清空inputText
        this.inputTextRef.setNativeProps({text: ''});
    }

    onTextChange(text) {
        LayoutAnimation.configureNext({
            duration: 300, //持续时间
            create: { // 视图创建
                type: LayoutAnimation.Types.spring,
                property: LayoutAnimation.Properties.opacity,// opacity、scaleXY
            },
            update: { // 视图更新
                type: LayoutAnimation.Types.spring,
                property: LayoutAnimation.Properties.opacity,
            },
            delete: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity,
            }
        });
        this.setState(() => {
            return {
                text
            };
        });
    }

    render() {

        let submit = null;
        if (this.state.text !== '') {
            submit = <View style={{ marginLeft: 5 }}>
                <TouchableHighlight
                    style={styles.button}
                    onPress={this.onSubmit}
                >
                    <ImageBackground style={styles.textBg}>
                        <Text style={styles.text}>发送</Text>
                    </ImageBackground>
                </TouchableHighlight>
            </View>
        }

        return (
            <View style={this.props.style}>
                <View style={styles.container}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={this.onTextChange}
                        onSubmitEditing={this.onSubmit}
                        ref={(comp) => { this.inputTextRef = comp }}
                    />
                    {submit}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#f1f1f1',
        flex: 1,
        // 横向排列
        flexDirection: 'row',
        // 交叉轴对其方式
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 20,
    },
    button: {
    },
    textBg: {
        borderRadius: 2,
        backgroundColor: '#51a838',
        borderColor: '#4c873f',
        borderWidth: 1,
        elevation: 1,
    },
    text: {
        fontSize: 20,
        padding: 5,
        color: '#fff',
    }
});