import 'dart:math';

class God {

}

// 定义class

// class中的变量
class Cls {
  String type1;
}

// 使用构造函数
class Cls1 {
  String name;

  Cls1(String name) {
    this.name = name;
  }
}

// 使用语法糖
class Cls2 {
  String name;

  Cls2(this.name) {
    print(this.name);
  }
}

// 使用有名的构造函数
class Cls3 {
  String name;

  Cls3.namedConstructor() {
    name = 'namedConstructor';
  }
}

// Initializer list
class Cls4 {
  String name;

  Cls4.namedConstructor(String n)
    : name = n {
    print(this.name);
  }
}

// 常量构造函数
class Cls5 {
  static final Cls5 origin = const Cls5("origin static");

  final String name;

  const Cls5(this.name);
}

class Logger {
  final String name;
  bool mute = false;

  // _cache is library-private, thanks to
  // the _ in front of its name.
  static final Map<String, Logger> _cache =
  <String, Logger>{};

  factory Logger(String name) {
    return _cache.putIfAbsent(
        name, () => Logger._internal(name));
  }

  Logger._internal(this.name);

  void log(String msg) {
    if (!mute) print(msg);
  }
}

void main() {
  // new是可选的
  var p1 = Point(2, 2);
  print(p1);

  // 使用常量构造函数
  // var p = const ImmutablePoint()

  // type
  God g = God();
  print(g.runtimeType);


  var c2 = new Cls2("Cls2");


  var c3 = new Cls3.namedConstructor();
  print(c3.name);

  new Cls4.namedConstructor("Cls4");

  var c5 = new Cls5("Cls");
  print(Cls5.origin.name);

  var logger = new Logger("");
}