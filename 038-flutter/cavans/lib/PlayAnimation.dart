import 'dart:async';
import 'dart:collection';

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

import 'dart:math';

class PlayAnimation extends StatefulWidget {

  // 产生间隔
  Duration interval;
  // 动画时长
  Duration animationDuration;
  // 其实半径
  int beginR;
  // 旋转角度
  double deg;

  PlayAnimation({
    Key key,
    this.interval = const Duration(seconds: 1),
    this.animationDuration = const Duration(seconds: 1),
    this.beginR = 0,
    this.deg = 0.5,
  }): super(key: key);

  @override
  PlayAnimationState createState() {
    return PlayAnimationState();
  }
}

class PlayAnimationState extends State<PlayAnimation> with TickerProviderStateMixin {

  // 动画回调控制
  Ticker _ticker;
  // 动画状态管理
  Queue<AnimationProgress> _progresses;

  // test
  bool test = true;

  @override
  void initState() {
    super.initState();

    _progresses = Queue<AnimationProgress>();

    _ticker = this.createTicker(_tick);
    _ticker.start();

    // 插入新的动画
    _createACircle();
    Timer.periodic(widget.interval, (_) {
      _createACircle();
    });
  }

  void _createACircle() {
    _progresses.add(AnimationProgress(widget.animationDuration));
  }

  void _tick(Duration elapsed) {

    // 清除结束的动画
    _progresses.removeWhere((progress) => progress.isComplete);
    // 更新动画进度
    _progresses.forEach((progress) => progress.updateProgress());
    // rebuild
    setState(() {

    });
  }

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: PlayPainter(circles: _progresses, playAnimation: widget),
      isComplex: false,
      willChange: true,
    );
  }

  @override
  void dispose() {
    _ticker.stop();
    super.dispose();
  }
}

class PlayPainter extends CustomPainter {

  Queue<AnimationProgress> circles;
  PlayAnimation playAnimation;

  Paint circlePaint = Paint();
  Paint pointPaint = Paint();
  Paint initCirclePaint = Paint();

  PlayPainter({this.circles, this.playAnimation}) {
    circlePaint.color = Colors.white;
    circlePaint.strokeWidth = 1;
    circlePaint.style = PaintingStyle.stroke;

    pointPaint.color = Colors.white;
    pointPaint.style = PaintingStyle.fill;

    initCirclePaint.color = Colors.white.withAlpha(120);
    initCirclePaint.strokeWidth = 1;
    initCirclePaint.style = PaintingStyle.stroke;
  }

  @override
  void paint(Canvas canvas, Size size) {

    // 中心位置
    Offset center = Offset(size.width/2, size.height/2);

    canvas.drawCircle(center, playAnimation.beginR.toDouble()/2, initCirclePaint);
    circles.forEach((circle) {


      canvas.saveLayer(Rect.fromLTWH(0, 0, size.width, size.height), Paint()..color = Colors.white.withAlpha((200*circle.reverseProgress).toInt()));

      // 半径
      double r = (playAnimation.beginR + (size.width - playAnimation.beginR)*circle.progress)/2;

      // 圆
      canvas.drawCircle(center, r, circlePaint);

      // 点
      double dx = center.dx + sin(playAnimation.deg * circle.reverseProgress * pi + 2*circle.randon*pi)*r;
      double dy = center.dy + cos(playAnimation.deg * circle.reverseProgress * pi + 2*circle.randon*pi)*r;

      canvas.drawCircle(Offset(dx,dy), 5, pointPaint);


      canvas.restore();
    });
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) {
    return true;
  }
}

class AnimationProgress {
  DateTime startTime;
  DateTime endTime;
  double progress;
  int totalTime;
  double randon;

  AnimationProgress(Duration duration) {
    startTime = DateTime.now();
    endTime = startTime.add(duration);
    progress = 0;
    totalTime = endTime.difference(startTime).inMilliseconds;
    randon = Random().nextDouble();
  }

  get isComplete => progress >= 1;

  get reverseProgress => 1 - progress;

  void updateProgress() {
    if (DateTime.now().compareTo(endTime) == 1) {
      progress = 1;
    } else {
      int passTime = DateTime.now().difference(startTime).inMilliseconds;
      progress = passTime.toDouble() / totalTime.toDouble();
    }
  }
}