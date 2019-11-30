import 'package:flutter/material.dart';
import 'package:svgaplayer_flutter/svgaplayer_flutter.dart';
import 'PlayAnimation.dart';
void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {


  int index = 0;

  @override
  Widget build(BuildContext context) {

    Widget test = Container();

    if (index == 1) {
      test = Container(
        color: Colors.black,
        child: SizedBox(
          height: 400,
          width: 400,
          child: PlayAnimation(
            interval: Duration(milliseconds: 700),
            animationDuration: Duration(seconds: 2),
            beginR: 150,
          ),
        ),
      );
    } else if (index == 2) {
      test = Image.network("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574312268905&di=784ff5486de1fc936a6caf946c13bdb3&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201411%2F30%2F20141130181540_3kini.gif",
        width: 300,
        height: 300,
      );
    } else if (index == 3) {
      test = Container(
        color: Colors.black,
        child: SizedBox(
          width: 500,
          height: 500,
          child: SVGASimpleImage(
            assetsName: "svga/test.svga",
            // resUrl: "https://github.com/yyued/SVGA-Samples/blob/master/angel.svga?raw=true",
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(widget.title),
      ),
      body: Container(
        child: Stack(
          alignment: Alignment.center,
          children: <Widget>[

            Container(
              width: double.infinity,
              height: double.infinity,
            ),

            test,

            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              height: 50,
              child: RaisedButton(
                child: Text("cavans"),
                onPressed: () {
                  index = 1;
                  setState(() {

                  });
                },
              ),
            ),
            Positioned(
              bottom: 50,
              left: 0,
              right: 0,
              height: 50,
              child: RaisedButton(
                child: Text("gif"),
                onPressed: () {
                  index = 2;
                  setState(() {

                  });
                },
              ),
            ),
            Positioned(
              bottom: 100,
              left: 0,
              right: 0,
              height: 50,
              child: RaisedButton(
                child: Text("svga"),
                onPressed: () {
                  index = 3;
                  setState(() {

                  });
                },
              ),
            )
          ],
        ),

      )
    );
  }
}
