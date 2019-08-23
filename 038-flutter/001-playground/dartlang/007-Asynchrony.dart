import 'dart:async';

void main() {
  Future lookUpVersion() async {
    print('lookUpVersion start');
    Future<String> f = Future<String>.delayed(Duration(seconds: 2), () {
      return "123";
    });
    print('lookUpVersion end');
    return f;
  };

  void checkVersion() async {
    print('checkVersion start');
    String v = await lookUpVersion();

    print(v);
    print('checkVersion end');
  }

  checkVersion();


  // 第二种方法

  var future = Future( () {});
}