var tobeExtend = {

    extend: function(option) {

        function copyProp(target, source) {
            for (prop in source) {
                // function
                if (typeof(source[prop]) === 'function') {
                    target[prop] = source[prop];
                }
                // String
                if (typeof(source[prop]) === 'string') {
                    target[prop] = source[prop];
                }
            }
        }

        var son = function() {
            // this.prototype = Object(Object.prototype);
            copyProp(this, tobeExtend);
            copyProp(this, option);
        }
        return son;
    }
}

console.info('tobeExtend: ', tobeExtend);

tobeExtend.__proto__.extend = tobeExtend.extend;

var son = tobeExtend.extend({
    test: function() {
        console.info('test: ', this.testP);
    },
    testP: 'testP'
})

var son1 = new son();

console.info('son1', son1);
console.info('son', son);

var sonOfson = son.extend({
    sonOfsonProp: 'sonOfson'
});

var sonOfson1 = new sonOfson();

console.info('sonOfson:', sonOfson1);
