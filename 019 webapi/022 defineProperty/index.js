let reactiveObj = {
    val: 1
}

function initReact(obj) {
    let _data = {
        val: obj.val
    }

    Object.defineProperty(obj, 'val', {
        get: function() {
            console.info('get', _data.val);
            return _data.val;
        },
        set: function(newVal) {
            console.info('set', newVal);
            _data.val = newVal;
        }
    })
}

initReact(reactiveObj);

reactiveObj.val;

reactiveObj.val = 2;

console.info(reactiveObj.val);