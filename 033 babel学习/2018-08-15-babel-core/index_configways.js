const babel = require('@babel/core');

const code = `const tt = 1`;

const opts = {
    //compact: true
}

babel.transform(code, opts,(err, result) => {    
    if (err) {
        console.error(err);
    } else {
        console.info(result);
    }
})