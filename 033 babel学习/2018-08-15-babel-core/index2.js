const babel = require('@babel/core');
const RN = require('babel-preset-react-native');

const code = `const tt = <div />`;

const opts = {
    ast: true,
    // auxiliaryCommentAfter: 'auxiliaryCommentAfter',
    // auxiliaryCommentBefore: 'auxiliaryCommentBefore',
    generatorOpts: {
        filename: 'out.js'
    },
    presets: [RN],
    parserOpts: {
        // plugins: [
        //     "jsx",
        // ]
    },
    retainLines: false,
    sourceMaps: 'both',
    sourceType: 'module'
}

babel.transform(code, opts,(err, result) => {    
    if (err) {
        console.error(err);
    } else {
        console.info(result);
    }
})