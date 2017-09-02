var father = {
    fatherProp: 'fatherProp',

    get: function(key) {
        return this[key];
    },

    set: function(key, val) {
        this[key] = val;
    },

    extend: function(option) {
        
            var son = function() {
                this.prototype = Object(Object.prototype);
                for (prop in father) {
                    console.info('复制属性: ' + prop, '类型' + typeof(father[prop]));
                    // function
                    if (typeof(father[prop]) === 'function') {
                        this.prototype[prop] = father[prop];
                    }
                    // String
                    if (typeof(father[prop]) === 'string') {
                        this[prop] = father[prop];
                    }
                }

                for (prop in option) {
                    console.info('复制属性: ' + prop, '类型' + typeof(option[prop]));
                    // function
                    if (typeof(option[prop]) === 'function') {
                        this.prototype[prop] = option[prop];
                    }
                    // String
                    if (typeof(option[prop]) === 'string') {
                        this[prop] = option[prop];
                    }
                }
            }
            return son;
        }
}

var son = father.extend({
    test: function() {
        console.info('test: ', this.testP);
    },
    testP: 'testP'
})

var son1 = new son();
console.info('son1', son1);
console.info('父亲的属性fatherProp：' + son1.fatherProp);
console.info('孩子的属性testP：' + son1.testP);

son1.set('fatherProp', 'fatherProp setted');
console.info('父亲的属性fatherProp：' + son1.fatherProp);
son1.testP = 'testP setted';
console.info('父亲的属性testP：' + son1.testP);