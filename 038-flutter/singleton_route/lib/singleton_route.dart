import 'package:flutter/material.dart';
import 'dart:async';
import './navigator_keeper.dart';

typedef Route<T> GenerateRoute<T>(RouteSettings settings);

class SingletonRoute {
  GlobalKey<NavigatorState> navigatorKey = GlobalKey();

  Map<String, RouteConfig> routeConfigs = {};

  // 监控路由栈
  NavigatorKeeper navigatorKeeper = NavigatorKeeper();

  SingletonRoute();

  void define({
    @required path,
    GenerateRoute generateRoute,
    bool isSingleton = false,
    String exclusiveGroup,
  }) {
    RouteConfig routeConfig = RouteConfig(
      name: path,
      isSingleton: isSingleton,
      exclusiveGroup: exclusiveGroup,
      generateRoute: generateRoute,
    );

    routeConfigs[path] = routeConfig;
  }

  Route<dynamic> onGenerateRoute(RouteSettings settings) {
    RouteConfig target = routeConfigs[settings.name];

    assert(target != null, "无法找到对应的导航");

    if (target.isSingleton) {
      _removeRouteWithPopups(target.name);
    }

    if (target.exclusiveGroup != null) {
      _removeExclusiveGroup(target.exclusiveGroup);
    }

    return target.generateRoute(settings);
  }

  void _removeRoute(Route<dynamic> route) {
    navigatorKey.currentState.removeRoute(route);
  }

  // 删除route
  void _removeRouteWithPopups(String routeName) {
    int firstModalRoute = navigatorKeeper.indexOf(name: routeName, type: RouteType.ModalRoute);
    // 如果存在需要删除的page
    if (firstModalRoute != -1) {
      int nextModalRoute = navigatorKeeper.indexOfType(type: RouteType.ModalRoute, start: firstModalRoute+1);

      // 查找popup
      List<RouteData> popups = navigatorKeeper.routes.sublist(
          firstModalRoute,
          nextModalRoute == -1 ? navigatorKeeper.routes.length : firstModalRoute+nextModalRoute)
          .where((route) {
        return route.type == RouteType.PopupRoute;
      }).toList();
      // 删除popup
      popups.forEach((popup) {
        _removeRoute(popup.route);
      });

      // 删除route
      Route toDelete = navigatorKeeper.routes[firstModalRoute].route;
      _removeRoute(toDelete);
    }
  }

  // 删除互斥组
  void _removeExclusiveGroup(String groupName) {
    navigatorKeeper.routes.forEach((route) {
      RouteConfig routeConfig = routeConfigs[route.name];

      if (routeConfig != null && routeConfig.exclusiveGroup == groupName) {
        scheduleMicrotask(() {
          _removeRouteWithPopups(route.name);
        });
      }
    });
  }
}

class RouteConfig {
  final String name;
  final bool isSingleton;
  final String exclusiveGroup;
  final GenerateRoute generateRoute;

  const RouteConfig({this.name ,this.isSingleton, this.exclusiveGroup, this.generateRoute});
}