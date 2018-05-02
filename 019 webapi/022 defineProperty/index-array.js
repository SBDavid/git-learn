let reactiveObj = {
    val: [1,2]
}



function initReact(obj, key, val) {
    let property = Object.getOwnPropertyDescriptor(reactiveObj, key);

    Object.defineProperty(obj, key, {
        get: function() {
            console.info('get');
            return property.getter ? property.getter.call(obj) : val;
        },
        set: function(newVal) {
            console.info('set');
            property.setter ? property.setter.call(obj, newVal) : val = newVal;
        }
    })
}

initReact(reactiveObj.val, '[0]', reactiveObj.val[0]);


console.info('reactiveObj.val[0]', reactiveObj.val, reactiveObj.val[0]);
reactiveObj.val = [];
console.info('reactiveObj.val[0]', reactiveObj.val, reactiveObj.val[0]);
