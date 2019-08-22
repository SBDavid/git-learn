import 'dart:math' deferred as hello;


void greet() async {
  await hello.loadLibrary();
  var test = hello.tan(1);
  print(test);
}

void main() {
  greet();
}