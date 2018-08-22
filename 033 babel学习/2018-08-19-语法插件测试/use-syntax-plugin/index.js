const babel = require('@babel/core');
const RN = require('babel-preset-react-native');
const code = `
var abc = {
  a: function (){

  }
}
`;

// 插件
const plugin = {
    visitor: {
        Identifier(path, state) {
            // console.info('Identifier');
            // if (path.node.name === 'a') {
            //     console.info('find a');
            //     path.node.name = 'aaa'
            // }
            // if (path.node.name === 'aaa') {
            //     console.info('find aaa');
            // }
        },
        Program(path, state) {
            // console.info('program')
            // console.info('opts', state.opts)
            // console.info('code', state.file.code);
        },
        FunctionExpression(path, state) {
            console.info(path.node.id);
        }
    },
    // 设置了该方法的插件优先解析--- 字符串，优先加载内置的词法、语法解析器，比如jsx、ts、flow、estree
    manipulateOptions(opts, parserOpts) {
        // console.info('manipulateOptions');
        // console.info('opts', opts);
        // console.info('parserOpts', parserOpts);
        // parserOpts.plugins.push('typescript');
        // parserOpts.plugins.push('jsx');
    },
};

const funPlugin = function(api, opt, file) {
    console.info(api.template);
    return {};
}

const myPreset1 = () => ({

    plugins: [
        [plugin, {name: 'plugin11'}],
        [plugin, {name: 'plugin12'}]
    ]
});

const myPreset2 = () => ({
    presets: [],
    plugins: [
        [require('@babel/plugin-transform-function-name')],
    ]
});

const config1 = {
    presets: [myPreset2],
    plugins: [
        [plugin, {name: 'plugin01'}],
        // [require('@babel/plugin-transform-function-name')],
    ]
};

const config2 = {
    plugins: [
        [plugin, {name: 'plugin01'}]
    ]
}

const config3 = {
    plugins: [
        funPlugin
    ]
}

const config4 = {
    presets: [
        RN
    ]
}

babel.transform(code, config3, function (err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log(result.code);
    }
});