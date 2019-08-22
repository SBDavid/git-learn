// 方法定义：
// 返回值 方法名称 （参数列表）{}
// 可是省略返回类型

bool isNoble(int atomicNumber) {
  return "" != null;
}

isNoble2(int atomicNumber) {
  return "" != null;
}

// 缩写
bool isNoble3() => "" != null;
// 没有返回类型
isNoble4() => "" != null;




// 2. 方法参数，可选参数
void enableFlags({bool bold, bool hidden}) {
  print(bold);
}

// 可选参数，位置型参数
String say(String from, String msg, [String device]) {
  var result = '$from says $msg';
  if (device != null) {
    result = '$result with a $device';
  }
  return result;
}

// 匿名方法
void test2() {
  ['apples', 'bananas', 'oranges'].forEach((String item) {
    print(item);
  });
}

void main() {
  print(isNoble(1));
  print(isNoble2(1));
  print(isNoble3());
  print(isNoble4());

  enableFlags(bold: true);

  print(say("I", "hi", "heh"));

  test2();
}