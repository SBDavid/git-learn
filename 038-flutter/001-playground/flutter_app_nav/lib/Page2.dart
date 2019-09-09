import 'package:flutter/material.dart';

class Page2 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
      appBar: AppBar(
        title: Text("Page2"),
      ),
      body: Center(
        child: Column(
          children: <Widget>[
            FlatButton(
              onPressed: () {
                Navigator.popAndPushNamed(context, 'page1');
              },
              child: Text("popAndPushNamed"),
            ),
            FlatButton(
              onPressed: () {
                Navigator.popUntil(context, ModalRoute.withName('/'));
              },
              child: Text("popUntil"),
            ),
            FlatButton(
              onPressed: () {
                Navigator.pushNamedAndRemoveUntil(context, 'page2', ModalRoute.withName('/'));
              },
              child: Text("pushNamedAndRemoveUntil"),
            ),
            FlatButton(
              onPressed: () {
                Navigator.pushReplacementNamed(context, 'page2',);
              },
              child: Text("pushReplacementNamed"),
            ),
            GestureDetector(
                child: Text('打开simpledialog', style: TextStyle(fontSize: 25, color: Colors.green)),
                onTap: () {
                  showDialog(
                      context: context,
                      builder: (BuildContext context) {
                        return SimpleDialog(
                          title: Text('弹窗标题'),
                          children: <Widget>[
                            SimpleDialogOption(
                              onPressed: () { Navigator.of(context).pop(); },
                              child: const Text('Treasury department'),
                            ),
                            SimpleDialogOption(
                              onPressed: () { Navigator.pushNamed(context, 'page1'); },
                              child: const Text('State department'),
                            ),
                          ],
                        );
                      }
                  );
                }
            ),
          ],
        ),
      ),
    );
  }
}

