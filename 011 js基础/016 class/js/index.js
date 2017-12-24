class Point {
    constructor(x, y) {
        console.log('new.target', new.target)
        this.x = x;
        this.y = y;
        this.fun = function () {
            console.log('实例方法')
        }
    }

    get prop() {
        return 'getter';
    }
    set prop(value) {
        console.log('setter: ' + value);
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }

    ['test' + 'fun']() {
        return 'test';
    }
}

let p = new Point(1, 2);
console.info(p)

class point2 extends Point {
    constructor() {
        super();
    }
}

let p2 = new point2(1, 2);
console.info(p2)