// get and set

class Cls1 {
  String _name;

  Cls1(String name) {
    this._name = name;
  }

  String get name {
    return this._name;
  }

  set name(String name) {
    this._name = name;
  }
}

// 抽象方法，只存在于抽象类中
abstract class Cls2 {
  void test();
}

// 实现一个接口
class Cls3 {
  String name;

  say() {
    print(this.name);
  }
}

class Cls31 extends Cls3 {

  Cls31(String name) {
    this.name = name;
  }

  @override
  say() {
    print("Cls31 $name");
    super.say();
  }
}

void main() {
  new Cls1("Cls1");

  var c31 = Cls31("name");
  c31.say();
}