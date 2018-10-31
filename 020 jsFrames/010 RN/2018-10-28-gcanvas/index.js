/** @format */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
/* import MyPromise from 'promise';
Promise = MyPromise;

const handlePromiseRejections = () => {
    const tracking = require('promise/lib/rejection-tracking')
    tracking.enable({
        allRejections: true,
        onUnhandled: function (id, error) {
            console.info('catch onUnhandled error in promise', id, error);
        },
        onHandled: function () {
            
        }
    })
}

// 全局异常处理
const handleUncaughtErrors = () => {
    const previousHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler((error, isFatal) => {
        console.info('catch unhandled error globaly', error, isFatal)
        if (previousHandler) {
            //previousHandler(error, isFatal)
        }
    });
} */

/* handleUncaughtErrors();
handlePromiseRejections();

console.info(Promise._onReject) */

AppRegistry.registerComponent(appName, () => App);

