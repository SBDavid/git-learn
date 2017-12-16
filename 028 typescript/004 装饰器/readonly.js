function readonly(target, name, descriptor){
    // descriptor对象原来的值如下
    // {
    //   value: specifiedFunction,
    //   enumerable: false,
    //   configurable: true,
    //   writable: true
    // };
    descriptor.writable = false;
    return descriptor;
  }

  class Person {
    @readonly
    name() { return `${this.first} ${this.last}` }
  }

  Person.prototype.name = function() {
      
  }