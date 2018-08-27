const babel = require('@babel/core');
const RN = require('babel-preset-react-native');
const code = `
const abc = {
  a: function (){

  },
  b: function (){

  }
}
`;

// 插件
const plugin = {
    visitor: {
        Identifier(path) {
            if (path.node.name === 'a') {
                // console.info('find a', path.parentPath.node);
            }
        }
    },
    // 设置了该方法的插件优先解析--- 字符串，优先加载内置的词法、语法解析器，比如jsx、ts、flow、estree
    manipulateOptions(opts, parserOpts) {
        console.info('manipulateOptions');
        // parserOpts.plugins.push('typescript');
        // parserOpts.plugins.push('jsx');
    },
};

babel.transform(code, {
    plugins: [plugin],
    presets: [RN],
}, function (err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log(result);
    }
});