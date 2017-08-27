function cfp() {
    this.cfp1 = 'sfp1';
}

cfp.cfp2 = 'cfp2';

function     {
    this.p1 = 'p1';
    this.p2 = 'p2';
}

cf.prototype = cfp;

var cf1 = new cf(); cf1.p1 = 'test';
var cf2 = new cf();

console.info('cf1', cf1)
console.info('cf2', cf2)

function cff() {
    this.p1 = 'p1';
    this.p2 = 'p2';
}

cff.prototype = cfp;

var cf3 = new cff();