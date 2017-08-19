window.onload = function () {
    // 构造带有参数的Object
    var test1 = new Object('test', 12);
    console.info('构造带有参数的Object：', test1, test1.length);

    // deep copy
    var obj1 = { a: 0, b: { c: 0 } };
     console.info('json.stringify', JSON.stringify(obj1));
    console.info('JSON.parse', JSON.parse(JSON.stringify(obj1))); */

    // Object.create
    function Shape() {
        console.info('Shape');
    }

    Shape.prototype.move = function () {
        console.info('Shape moved.');
    };

    function Rectangle() {
        Shape.call(this); // call super constructor.
    }

    Rectangle.prototype = Object.create(Shape.prototype);
    Rectangle.prototype.constructor = Rectangle;

    var rect = new Rectangle();
    rect.move(); 

    // defineProperty

    function testObj() {
        Object.defineProperty(this, 'key', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: 'static'
        });
    }

    

    console.info((new testObj()).key);
}