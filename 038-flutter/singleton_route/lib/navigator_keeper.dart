// 监控路由状态，并保存路由栈
import 'package:flutter/material.dart';

enum RouteType { ModalRoute, PopupRoute }

class RouteData {
  final RouteType type;
  final String name;
  final Route route;

  RouteData({this.name, this.type, this.route,});

  @override
  int get hashCode {
    return (name.hashCode.toString() + type.hashCode.toString()).hashCode;
  }

  @override
  bool operator ==(other) {
    return other.hashCode == hashCode;
  }

  @override
  String toString() {
    return 'RouteData{ name: $name, type: $type }';
  }
}

class NavigatorKeeper extends NavigatorObserver {
  List<RouteData> routes = [];

  static RouteType findType(Route route) {
    if (route is PopupRoute) {
      return RouteType.PopupRoute;
    } else {
      return RouteType.ModalRoute;
    }
  }

  @override
  void didPush(Route route, Route previousRoute) {
    print("didPush");
    super.didPush(route, previousRoute);
    routes.add(RouteData(name: route.settings.name, type: findType(route), route: route));
  }

  @override
  void didPop(Route route, Route previousRoute) {
    print("didPop");
    super.didPop(route, previousRoute);
    routes.removeLast();
  }

  @override
  void didRemove(Route route, Route previousRoute) {
    print("didRemove");
    super.didRemove(route, previousRoute);
    int index = routes.lastIndexOf(RouteData(name: route.settings.name, type: findType(route)));

    if (index != -1) {
      routes.removeAt(index);
    }
  }

  @override
  void didReplace({Route newRoute, Route oldRoute}) {
    super.didReplace(newRoute: newRoute, oldRoute: oldRoute);

    int index = routes.lastIndexOf(RouteData(name: oldRoute.settings.name, type: findType(oldRoute)));
    assert(index != -1);
    routes.removeAt(index);
    routes.insert(index, RouteData(name: newRoute.settings.name, type: findType(newRoute)));
  }

  get topRoute {
    assert(routes.isNotEmpty);

    return routes.last;
  }

  get topModelRoute {
    assert(routes.isNotEmpty);

    return routes.lastWhere((route) {
      return route.type == RouteType.ModalRoute;
    });

  }

  get popUpOnTop {
    return routes.last.type == RouteType.PopupRoute;
  }

  int indexOf({@required String name, @required RouteType type, int start = 0}) {
    return routes.indexOf(RouteData(name: name, type: type), start);
  }

  int indexOfType({ @required RouteType type, int start = 0}) {
    return routes.indexWhere((route) {
      return route.type == type;
    }, start);
  }

  int count({@required String name, @required RouteType type}) {
    return routes.where((route) {
      return route.name == name && route.type == type;
    }).length;
  }


}