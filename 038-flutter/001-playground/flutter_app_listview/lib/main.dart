import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:math';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final title = 'Horizontal List';

    return MaterialApp(

      title: title,
      home: Scaffold(
        appBar: null,
        body: Column(
          children: <Widget>[
            Row(
              children: <Widget>[
                Expanded(
                  child: Container(
                    color: Colors.pink,
                    child: AnimatedTitle(),
                  ),
                ),

              ],
            ),
            Expanded(
                child: Container(
                  decoration: const BoxDecoration(
                    color: Colors.blueAccent,
                    border: Border(
                      top: BorderSide(width: 10.0, color: Colors.black),
                      left: BorderSide(width: 10.0, color: Color(0xFFFFDFDFDF)),
                      right: BorderSide(width: 10.0, color: Color(0xFFFF7F7F7F)),
                      bottom: BorderSide(width: 10.0, color: Color(0xFFFF7F7F7F)),
                    ),
                  ),
                  child: StatefulContainer(),
                )
            ),
          ],
        ),
      ),
    );
  }
}

// 顶级容器
class StatefulContainer extends StatefulWidget {
  @override
  _StatefulContainerState createState() => new _StatefulContainerState();
}

class _StatefulContainerState extends State<StatefulContainer> {
  bool showTop = true;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.lightBlue,
      child: InfiniteListView(),
    );
  }
}


// 固定标题
class Title extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.pinkAccent,
      height: 100,
      child: Center(
        child: Text("I am visable",),
      )
    );
  }
}

// 变化高度的标题
class AnimatedTitle extends StatefulWidget {
  @override
  AnimatedTitleState createState() {
    // TODO: implement createState
    return AnimatedTitleState();
  }
}
class AnimatedTitleState extends State<AnimatedTitle> {

  double _height = 100;
  Timer _timer;

  @override
  void initState() {
    super.initState();

    _timer = new Timer.periodic(const Duration(seconds: 1), (Timer timer) {
      setState(() {
        _height = 0;
      });
    });
  }

  @override
  Widget build(BuildContext context) {

    return AnimatedContainer(
      height: _height,
      child: Title(),
      duration: Duration(seconds: 2),
    );
  }
}


// 滚动列表
class InfiniteListView extends StatefulWidget {
  @override
  _InfiniteListViewState createState() => new _InfiniteListViewState();
}

class _InfiniteListViewState extends State<InfiniteListView> {
  List<Color> colorCodes = <Color>[Colors.lightBlue, Colors.amber, Colors.deepOrange];
  Timer timer;
  Random r = new Random();
  ScrollController sc = ScrollController();

  @override
  void initState() {
    super.initState();
    /*timer = new Timer.periodic(const Duration(seconds: 1), (Timer timer) {
      colorCodes.add(Colors.black);
      setState(() {

      });
    });*/
    
    sc.addListener(() {
      // print(sc.offset);
      if (sc.offset == 0) {

      } else {

      }
    });
  }

  @override
  Widget build(BuildContext context) {

    return Container(
      color: Colors.tealAccent,
      child: ListView.builder(

        padding: const EdgeInsets.all(8.0),
        controller: sc,
        itemBuilder: (BuildContext context, int index) {

          if (index >= colorCodes.length) {
            colorCodes.add(Color.fromARGB(r.nextInt(255), r.nextInt(255), r.nextInt(255), r.nextInt(255)));
          }

          /*if (index == 0) {
            return Title();
          }*/

          return Container(
            height: 50,
            color: colorCodes[index],
            child: Center(child: Text('Entry ${colorCodes[index]}')),
          );
        }
      ),
    );
  }
}