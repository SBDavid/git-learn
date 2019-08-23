class People {
  String cType;
  People() {
    cType = 'People';
  }
}

class Man extends People {

}

class Women extends People {

}


void main() {
  // 类型判断

  // is 判断是否实现了某个接口，实例和类型之间的对比
  if (Man is People) {
    print('Man is People');
  } else {
    print('Man is not People');
  }

  Man aMan = new Man();
  if (aMan is People) {
    print('aMan is People');
  } else {
    print('aMan is not People');
  }

  if (aMan is Man) {
    print('aMan is Man');
  } else {
    print('aMan is not Man');
  }

  if (aMan is String) {
    print('aMan is String');
  } else {
    print('aMan is not String');
  }

  // as 类型转换
  print((aMan as People).cType);
}