void main() {
  // int
  int int1 = 0;
  int1.abs();
  int1.ceil();

  // 1. String -> int
  int.parse("12");

  // 2. int -> String
  1.toString();

  // double
  double double1 = 0.1;
  double1.floor();

  // 3. 转换
  double.parse("1.2");
  1.3.toString();



  // String
  var s4 = "It's even easier to use the other delimiter.";
  print(s4);

  // 字符串拼接
  String s5 = "test";
  String s6 = "$s5";
  String s7 = "${s5.toUpperCase()}";

  print(s7);

  // 多行
  String s8 = '''
    You can create
    multi-line strings like this one.
    ''';

  print(s8);

  // Booleans
  // 只有boolean值才可以进行if比较
  if ('111' == true) {
    print('\' == true');
  }

  if ('111' == false) {
    print('\' == false');
  }
  
  if (1 == true) {
    print('1 == true');
  }

  if (1 == false) {
    print('1 == false');
  }

  // Lists
  var list = [1, 2, 3];

  // 编译时常量
  var constantList = const [1, 2, 3];
  // constantList[0] = 1; // 编译时报错
  const list1 = [1, 2, 3];
  // list1[0] = 0; // 编译时报错

  // 数组扩展
  List<int> list2 = [1,2,4];
  List<int> list3 = [0, ...list2];
  print(list3);

  // Sets
  // 简单定义set
  Set<int> set1 = Set();
  set1.add(1);
  print(set1);

  // 简单初始化
  var set2 = {}; // 错误定义了map
  var set3 = <String>{};

  // 编译时常量
  final Set<int> set4 = const {
    1,2,3
  };

  // set4.add(3); // 编译时报错

  // set4 = {};   // 错误

}