import 'package:flutter/material.dart';

class PageA extends StatelessWidget {

  final String name;
  const PageA({this.name});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Text(name),
          RaisedButton(
            child: Text("to page a"),
            onPressed: () {
              Navigator.pushNamed(context, 'a');
            },
          ),
          RaisedButton(
            child: Text("to page b"),
            onPressed: () {
              Navigator.pushNamed(context, 'b');
            },
          ),
          RaisedButton(
            child: Text("pupup"),
            onPressed: () {
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return RaisedButton(
                    child: Text("pupup"),
                    onPressed: () {
                      showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            return FlutterLogo();
                          }
                      );
                    },
                  );
                }
              );
            },
          )
        ],
      )
    );
  }
}