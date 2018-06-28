/* 把object中的所有字段转化为字符串 */

var typeMap = {
    "[object String]": 'String',
    "[object Array]": 'Array',
    "[object Object]": 'Object',
    "[object Number]": 'Number',
    "[object Boolean]": 'Boolean',
    "[object Null]": 'Null',
    "[object Undefined]": 'Undefined'
}

function type(obj) {
    return typeMap[Object.prototype.toString.call(obj)];
}

function fieldStringify(obj) {
    // Object类型 或者 数组类型
    if (type(obj) === 'Object' || type(obj) === 'Array') {
        for(var key in obj) {
            if (!obj.hasOwnProperty(key)) {
                // 原型上的数据不做处理
                continue;
            }

            var target = obj[key];
            var targetType = type(target);

            if (targetType === 'Object' || targetType === 'Array') {
                fieldStringify(target);
            } else if (targetType === undefined) {
                continue;
            } else {
                obj[key] = String(target);
            }
        }
    }

    return obj;
}

module.exports = fieldStringify;