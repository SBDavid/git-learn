import React, { Component } from 'react';
import { WebView } from 'react-native';

export default class MyWeb extends Component {
  render() {
    return (
      <WebView
        javaScriptEnabled={true}
        onError={(err) => {
            console.info(err)
        }}
        onLoad={() => {
            console.info('onLoad')
        }}
        source={{uri: 'http://192.168.72.199:9000/webpack-dev-server/'}}
        style={{marginTop: 20}}
      />
    );
  }
}