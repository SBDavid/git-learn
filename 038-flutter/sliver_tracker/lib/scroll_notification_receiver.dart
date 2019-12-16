import 'package:flutter/material.dart';
import 'dart:async';

class ScrollNotificationReceiver extends StatefulWidget {

  final Widget child;

  const ScrollNotificationReceiver({Key key, this.child}): super(key: key);

  @override
  ScrollNotificationReceiverState createState() {
    return ScrollNotificationReceiverState();
  }

  static ScrollNotificationReceiverState of(BuildContext context) {
    return context.ancestorStateOfType(TypeMatcher<ScrollNotificationReceiverState>());
  }
}

class ScrollNotificationReceiverState extends State<ScrollNotificationReceiver> {

  StreamController<ScrollNotification> controller;
  Stream<ScrollNotification> broadCaseStream;

  @override
  void initState() {
    super.initState();
    controller = StreamController<ScrollNotification>();
    broadCaseStream = controller.stream.asBroadcastStream();
  }

  @override
  Widget build(BuildContext context) {
    return NotificationListener<ScrollNotification>(
      onNotification: (ScrollNotification notification) {

        controller.sink.add(notification);

        return false;
      },
      child: widget.child
    );
  }

  @override
  void dispose() {
    controller?.close();
    super.dispose();
  }
}