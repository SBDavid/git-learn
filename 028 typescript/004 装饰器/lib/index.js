var _dec, _class, _dec2, _class2;

function testable(isTestable) {
  return function (target) {
    target.isTestable = isTestable;
  };
}

let MyTestableClass = (_dec = testable(true), _dec(_class = class MyTestableClass {}) || _class);

MyTestableClass.isTestable; // true

let MyClass = (_dec2 = testable(false), _dec2(_class2 = class MyClass {}) || _class2);

MyClass.isTestable; // false