function base() {
    this.baseProp = 'baseProp';
};

base.prototype.baseFun = function() {
    console.info('baseFun', this);
}

function child() {
    this.childProp = 'childProp';
    base.apply(this);
}

child.prototype = new base();

var c = new child();

console.info(c);