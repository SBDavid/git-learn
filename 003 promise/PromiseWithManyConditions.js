function start(arg) {
    /* 
    这里是promise的开端 
    第一个异步造作会根据参数arg来选择执行不同的异步操作，
    并返回不同的结果
    */
    if (arg === 'conditionOne') {
        Promise.resolve('c1');
    }
    if (arg === 'conditionTwo') {
        Promise.resolve('c2');
    }
}

start('conditionOne')
.then(response => {
    /* 
    这是第二次一步操作，这里根据第二个判断条件otherCondition继续进入不同的异步操作 
    至此promise链中已经有了4条不同的分支
    */
    var otherCondition = 'ot1';

    if (response === 'c1') {
        if (otherCondition === 'ot1') {
            Promise.resolve('c11');
        } else {
            Promise.resolve('c12');
        }
    }

    if (response === 'c2') {
        if (otherCondition === 'ot1') {
            Promise.resolve('c21');
        } else {
            Promise.resolve('c21');
        }
    }
})
.then(response => {
    /* 越来越多的条件判断 */
})