import 'package:flutter/material.dart';
import 'dart:async';
import 'scroll_notification_receiver.dart';
import 'package:flutter/rendering.dart';

class SingleSliverTrack extends StatefulWidget {

  final Widget child;

  final void Function(
    ScrollEndNotification notification,
    SliverConstraints constraints,
    SliverGeometry geometry) onScrollEnd;

  const SingleSliverTrack({Key key, this.child, this.onScrollEnd}): super(key: key);

  @override
  SingleSliverTrackState createState() {
    return SingleSliverTrackState();
  }
}

class SingleSliverTrackState extends State<SingleSliverTrack> {

  StreamSubscription trackSB;

  Widget build(BuildContext context) {
    return widget.child;
  }

  @override
  void initState() {
    super.initState();

    trackSB = ScrollNotificationReceiver.of(context).broadCaseStream.listen((ScrollNotification notification) {

      if (!(notification is ScrollEndNotification)) {
        return;
      }

      RenderSliver renderSliver = context.ancestorRenderObjectOfType(TypeMatcher<RenderSliver>());
      widget.onScrollEnd(notification, renderSliver.constraints, renderSliver.geometry);
    });
  }

  @override
  void dispose() {
    trackSB?.cancel();
    super.dispose();
  }
}

class MultiSliverTrack extends StatefulWidget {

  final Widget child;

  final void Function(double) onScrollEndInViewport;

  const MultiSliverTrack({Key key, this.child, this.onScrollEndInViewport}): super(key: key);

  @override
  MultiSliverTrackState createState() {
    return MultiSliverTrackState();
  }
}

class MultiSliverTrackState extends State<MultiSliverTrack> {

  StreamSubscription trackSB;

  @override
  void initState() {
    super.initState();

    trackSB = ScrollNotificationReceiver.of(context).broadCaseStream.listen((ScrollNotification notification) {

      if (!(notification is ScrollEndNotification)) {
        return;
      }

      // RenderSliverList
      RenderSliverMultiBoxAdaptor renderSliverMultiBoxAdaptor = context.ancestorRenderObjectOfType(TypeMatcher<RenderSliverMultiBoxAdaptor>());
      // ScrollView的起始绘制位置
      double startOffset = renderSliverMultiBoxAdaptor.constraints.scrollOffset;
      // ScrollView的结束绘制位置
      double endOffset = startOffset + renderSliverMultiBoxAdaptor.geometry.paintExtent;
      // 主轴方向
      Axis axis = renderSliverMultiBoxAdaptor.constraints.axis;

      // 如果还没有显示到Viewport中
      if (endOffset == 0) {
        return;
      }

      // 当前item相对于列表起始位置的偏移 SliverLogicalParentData
      double itemLayoutOffset = 0;
      Size itemSize;
      context.visitAncestorElements((element) {
        if (element.renderObject == null) {
          return true;
        }

        if (element.renderObject.parentData == null) {
          return true;
        }

        if (!(element.renderObject.parentData is SliverLogicalParentData)) {
          return true;
        }

        itemLayoutOffset = (element.renderObject.parentData as SliverLogicalParentData).layoutOffset;
        itemSize = (element.renderObject as RenderBox).size;

        double itemStartOffset = itemLayoutOffset;
        double itemEndOffset = axis == Axis.vertical ? itemStartOffset + itemSize.height : itemStartOffset + itemSize.height;
        double itemStartOffsetClamp = itemStartOffset.clamp(startOffset, endOffset);
        double itemEndOffsetClamp = itemEndOffset.clamp(startOffset, endOffset);

        widget.onScrollEndInViewport((itemEndOffsetClamp - itemStartOffsetClamp)/(itemEndOffset - itemStartOffset));

        return false;
      });

    });
  }

  @override
  Widget build(BuildContext context) {
    return widget.child;
  }

  @override
  void dispose() {
    trackSB?.cancel();
    super.dispose();
  }
}

class MultiSliverUpdate extends StatefulWidget {
  final Widget Function(BuildContext, double) builder;

  const MultiSliverUpdate({Key key, this.builder,}): super(key: key);

  @override
  MultiSliverUpdateState createState() {
    return MultiSliverUpdateState();
  }
}

class MultiSliverUpdateState extends State<MultiSliverUpdate> {

  StreamSubscription sb;
  double displayPercent;

  @override
  void initState() {
    super.initState();
    displayPercent = 0;

    Future.microtask(() {
      refreshDisplayPercent();
    });

    sb = ScrollNotificationReceiver.of(context).broadCaseStream.listen((ScrollNotification notification) {

      if (!(notification is ScrollUpdateNotification)) {
        return;
      }

      refreshDisplayPercent();

    });
  }

  void refreshDisplayPercent() {
    double oldDisplayPercent = displayPercent;
    displayPercent = calculateDisplayPercent(context);

    if (oldDisplayPercent != displayPercent) {
      setState(() {

      });
    }
  }

  double calculateDisplayPercent(BuildContext context) {

    double _displayPercent = 0;

    // RenderSliverList
    RenderSliverMultiBoxAdaptor renderSliverMultiBoxAdaptor = context.ancestorRenderObjectOfType(TypeMatcher<RenderSliverMultiBoxAdaptor>());
    // ScrollView的起始绘制位置
    double startOffset = renderSliverMultiBoxAdaptor.constraints.scrollOffset;
    // ScrollView的结束绘制位置
    double endOffset = startOffset + renderSliverMultiBoxAdaptor.geometry.paintExtent;
    // 主轴方向
    Axis axis = renderSliverMultiBoxAdaptor.constraints.axis;

    // 如果还没有显示到Viewport中
    if (endOffset == 0) {
      return 0;
    }

    // 当前item相对于列表起始位置的偏移 SliverLogicalParentData
    double itemLayoutOffset = 0;
    Size itemSize;
    context.visitAncestorElements((element) {
      if (element.renderObject == null) {
        return true;
      }

      if (element.renderObject.parentData == null) {
        return true;
      }

      if (!(element.renderObject.parentData is SliverLogicalParentData)) {
        return true;
      }

      itemLayoutOffset = (element.renderObject.parentData as SliverLogicalParentData).layoutOffset;
      itemSize = (element.renderObject as RenderBox).size;

      double itemStartOffset = itemLayoutOffset;
      double itemEndOffset = axis == Axis.vertical ? itemStartOffset + itemSize.height : itemStartOffset + itemSize.height;
      double itemStartOffsetClamp = itemStartOffset.clamp(startOffset, endOffset);
      double itemEndOffsetClamp = itemEndOffset.clamp(startOffset, endOffset);

      _displayPercent = (itemEndOffsetClamp - itemStartOffsetClamp)/(itemEndOffset - itemStartOffset);

      return false;
    });

    return _displayPercent;
  }

  @override
  Widget build(BuildContext context) {
    return widget.builder(context, displayPercent);
  }

  @override
  void dispose() {
    sb?.cancel();
    super.dispose();
  }
}