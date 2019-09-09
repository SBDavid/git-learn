import 'package:flutter/material.dart';

enum RouteType { ModalRoute, PopupRoute }

class RouteData {
  final RouteType type;
  final String name;

  const RouteData({this.name, this.type});

  @override
  // TODO: implement hashCode
  int get hashCode => int.parse(name.hashCode.toString() + type.hashCode.toString());

  @override
  bool operator ==(other) {
    // TODO: implement ==
    return other.hashCode == hashCode;
  }

  @override
  String toString() {
    // TODO: implement toString
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
    super.didPush(route, previousRoute);
    routes.add(RouteData(name: route.settings.name, type: findType(route)));
    print('didPush');
    print(routes);
    print(topRoute);
    print(topModelRoute);
  }

  @override
  void didPop(Route route, Route previousRoute) {
    super.didPop(route, previousRoute);
    routes.removeLast();
    print('didPop');
    print(routes);
  }

  @override
  void didRemove(Route route, Route previousRoute) {
    super.didRemove(route, previousRoute);
    int index = routes.lastIndexOf(RouteData(name: route.settings.name, type: findType(route)));

    if (index != -1) {
      routes.removeAt(index);
    }

    print('didRemove');
    print(routes);
  }

  @override
  void didReplace({Route newRoute, Route oldRoute}) {
    super.didReplace(newRoute: newRoute, oldRoute: oldRoute);

    int index = routes.lastIndexOf(RouteData(name: oldRoute.settings.name, type: findType(oldRoute)));
    assert(index != -1);
    routes.removeAt(index);
    routes.insert(index, RouteData(name: newRoute.settings.name, type: findType(newRoute)));

    print('didReplace');
    print(routes);
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

  bool has({@required String name, @required RouteType type}) {
    return routes.indexOf(RouteData(name: name, type: type)) != -1;
  }
}