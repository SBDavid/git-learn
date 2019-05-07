"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function identity(arg) {
  return arg;
}

identity(0);
let myIndentity = {
  test: '',
  identity
};

class GenericNumber {
  constructor() {
    _defineProperty(this, "zeroValue", void 0);
  }

  add(x, y) {
    console.log(x);
    return x;
  }

}

let c = new GenericNumber();
c.add('11', '22');

function getProperty(obj, key) {
  return obj[key];
}

let x = {
  a: 1,
  b: 2,
  c: 3,
  d: 4
};

function getProperty2(obj, key) {
  return obj[key];
}

getProperty2(x, "aa"); // okay

function create(c) {
  return new c();
}

create(GenericNumber);
let personProps = 'age'; // 'name' | 'age'

console.info(personProps);