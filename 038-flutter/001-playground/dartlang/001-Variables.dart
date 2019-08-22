

void main() {

  // 1. 自动推断
  var name = 'bob';
  print(name);
  // 2. 自动推断类型
  dynamic name1 = 'bob';
  name1 = 123;
  print(name1);

  // 3. 指定类型
  String name3 = 'Bob';
  // 类型错误
  // name3 = 123;

  // 4. int 和 String的默认值都是null，因为它们是对象
  int defaultInt;
  String defaultString;

  print(defaultInt);
  print(defaultString);

  // 5. Final and const
  final name4 = 'bob'; // 自动推断
  final String name5 = 'bob';

  final bar = [1];
  // bar = [1]; // 报错 不能修改
  bar[0] = 3;

  const bar1 = [2];
  // bar1 = [1]; // 报错 不能修改
  bar1[0] = 1;

  final List<int> bar3 = [2];


}