function e1(ee) {
    this.ee = ee;
} 

const object1 = {
  a: 1,
  b: 2,
  c: 3,
  get d() {
      return this;
  },
  set d(t) {
      console.info(t);
  },
  e: new e1(123)
};

Object.defineProperty(object1, 'f', {
    enumerable: true,
    value: 'ee'
});

const object2 = Object.assign({}, object1);

console.log(object2);

// Object.assign可以拷贝source对象上所有的可迭代属性，
// 不可以拷贝继承、不可迭代的属性
// 拷贝get时，get会转换成对象，可以使用getOwnPropertyDescriptors解决这个问题
// set的拷贝无法实现
// 无法嫁接原型链
