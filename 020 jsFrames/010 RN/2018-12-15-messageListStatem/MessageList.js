import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { ScrollView, TouchableOpacity, View, Keyboard, Text } from 'react-native'

const machine = {
  // 初始状态，组件还未显示在屏幕上
  init: {
    LAYOUT: 'nonScroll' // Scroll Layout
  },
  // 不可滚动状态
  nonScroll: {
    ADD_MSG: 'nonScroll',   // 插入消息
    Enable_Scroll: 'stayAroundBottom' // 消息从长度 > ScrollView高度
  },
  // 静止在底部附近
  stayAroundBottom: {
    ADD_MSG: 'stayBelowBottom', // 插入消息
    DRAG_BEGIN: 'dragAroundBottom'
  },
  // 静止在上部
  stayAwayFromBottom: {
    SCROLL_BEGIN: 'scrollAwayFromBottom',
    DRAG_BEGIN: 'dragAwayFromBottom'
  },
  // 新消息超出底部
  stayBelowBottom: {
    SCROLL_BEGIN: 'scrollAroundBottom', // 在底部滚动
  },
  // 在底部滚动
  scrollAroundBottom: {
    SCROLL_END: 'stayAroundBottom', // 停止滚动
    DETTACH_BOTTOM: 'scrollAwayFromBottom'  // 滚动到上部
  },
  // 在上部移动
  scrollAwayFromBottom: {
    SCROLL_END: 'stayAwayFromBottom', // 停止滚动
    ATTACH_BOTTOM: 'scrollAroundBottom'  // 滚动到下部
  },
  // 在底部拖拽
  dragAroundBottom: {
    DRAG_END_STAY: 'stayAroundBottom', // 停止拖拽
    DRAG_END_SCROLL: 'scrollAroundBottom', // 停止拖拽
    DETTACH_BOTTOM: 'dragAwayFromBottom'  // 拖拽到上部
  },
  // 在上部部拖拽
  dragAwayFromBottom: {
    DRAG_END_STAY: 'stayAwayFromBottom', // 停止拖拽
    DRAG_END_SCROLL: 'scrollAwayFromBottom', // 停止拖拽
    ATTACH_BOTTOM: 'dragAroundBottom'  // 拖拽到下部
  }
}

export default class MessageList extends Component {
  constructor(props) {
    super(props)

    this.currentState = 'init'

    // 消息列表的引用
    this.listViewRef = null
    // 列表容器高度
    this.containerHeight = null
    // 离开底部多少距离，判定为离开底部
    this.leaveBottomOffset = 80
    // 停止移动计时器
    this.scrollEndTimer = null

    this.transition = this.transition.bind(this)
    this.command = this.command.bind(this)
    this.addMsg = this.addMsg.bind(this)
    this.scrollToEnd = this.scrollToEnd.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  // 状态转移
  transition(action) {
    const currentListState = this.currentState
    const nextListState = machine[currentListState][action.type]

    console.info('transition', currentListState, action.type, nextListState)

    if (nextListState) {
      this.command(currentListState, action)

      this.currentState = nextListState
    }
  }

  // 状态操作
  command(currentState, { type, payload }) {
    switch (currentState) {
      case 'init':
        if (type === 'LAYOUT') {
          const evt = payload
          this.containerHeight = evt.nativeEvent.layout.height
        }
        break
      case 'nonScroll':
        if (type === 'Enable_Scroll') {
          this.props.onContentLongerThanContainer()
        }
        break
      case 'stayAroundBottom':
        if (type === 'ADD_MSG') {
          const msg = payload
          this.addMsg(msg)
        } else if (type === 'DRAG_BEGIN') {
          this.props.onScrollBegin()
        }
        break
      case 'stayBelowBottom':
        if (type === 'SCROLL_BEGIN') {
        }
        break
      case 'scrollAroundBottom':
        if (type === 'SCROLL_END') {
          this.props.onScrollEnd()
        }
      case 'scrollAroundBottom':
        if (type === '') {
          
        }
      case 'dragAroundBottom': {
        if (type === 'DRAG_END_STAY') {
          this.props.onScrollEnd()
        }
      }
        break
    }
  }

  addMsg(msg) {
    this.props.onNewMsgLayout(msg)
  }

  scrollToEnd() {
    this.listViewRef && this.listViewRef.scrollToEnd({ animated: true })
  }

  onScroll(evt) {

    // 滚动开始
    if (this.scrollEndTimer === null) {
      this.transition({ type: 'SCROLL_BEGIN' })
    }

    // 判断是否离开列表底部
    const offsetY = evt.nativeEvent.contentOffset.y // 滑动距离
    const contentHeight = evt.nativeEvent.contentSize.height // scrollView 内容高
    const scrollHeight = evt.nativeEvent.layoutMeasurement.height // scrollView高度
    // scrollView高度 大于 scrollView内容高，在收到新消息后，不显示“查看新消息”按钮
    if (scrollHeight > contentHeight) {
      // DoNothing
    }
    // 滚动至中间，在收到新消息后，显示“查看新消息”按钮
    else if (offsetY + scrollHeight < contentHeight - this.leaveBottomOffset) {
      this.transition({ type: 'DETTACH_BOTTOM' })
    }
    // 滑动至底部，在收到新消息后，不显示“查看新消息”，再滚动到底部
    else if (offsetY + scrollHeight >= contentHeight - this.leaveBottomOffset) {
      this.transition({ type: 'ATTACH_BOTTOM' })
    }

    // 滚动停止
    clearTimeout(this.scrollEndTimer)
    this.scrollEndTimer = setTimeout(() => {
      this.scrollEndTimer = null
      this.transition({ type: 'SCROLL_END' })
    }, 60)
  }

  renderItem(msg, index) {
    const { type, data } = msg;
    const roomUid = this.props.roomUid // 很丑以后要去掉
    const MsgRender = this.props.msgRenders[type][data.type ? data.type : 'default'];

    if (!MsgRender) {
      if (__DEV__) {
        console.warn('msg类型未找到')
      }
      return null
    } else {
      return (
        <View key={index}>
          {/* 添加这一层的原因是：列表进行插入或者删除操作的时候，新增或是删除元素下方的元素全都会触发layout */}
          <View
            onLayout={() => {
              // 新消息插入
              this.transition({ type: 'ADD_MSG', payload: msg })
            }}
          >
            <MsgRender
              chatItem={msg}
              roomUid={roomUid}
            />
          </View>
        </View>
      )
    }
  }

  render() {
    const { msgs } = this.props
    const msgItems = msgs.map((item) => {
      return this.renderItem(item, item.uniqueId)
    })

    const res = (
      <View style={{
        width: '100%',
        flex: 1
      }}>
        <ScrollView
          scrollEventThrottle={32}
          showsVerticalScrollIndicator={false}
          ref={comp => { this.listViewRef = comp }}
          onLayout={(e) => {
            e.persist()
            this.transition({
              type: 'LAYOUT',
              payload: e
            })
          }}
          onContentSizeChange={(contentWidth, contentHeight) => {
            // 内容高度超过容器高度
            if (contentHeight >= this.containerHeight) {
              this.transition({
                type: 'Enable_Scroll'
              })
            } else {
              this.transition({
                type: 'ADD_MSG'
              })
            }
          }}
          onScroll={this.onScroll}
          onScrollBeginDrag={() => {
            this.transition({type: 'DRAG_BEGIN'})
          }}
          onScrollEndDrag={(evt) => {
            if (Math.abs(evt.nativeEvent.velocity.y) < 0.1 || this.scrollEndTimer === null) {
              this.transition({type: 'DRAG_END_STAY'})
            } else {
              this.transition({type: 'DRAG_END_SCROLL'})
            }
          }}
        >
          {msgItems}
        </ScrollView>
      </View>
    )
    return res
  }
}

MessageList.defaultProps = {
  onScrollBegin: () => { },
  onScrollEnd: () => { },
  onAttachBottom: () => { },
  onDettachBottom: () => { },
  onContentLongerThanContainer: () => { },
  onNewMsgLayout: () => { }
}

MessageList.propTypes = {
  msgs: PropTypes.array.isRequired,
  onScrollBegin: PropTypes.func,
  onScrollEnd: PropTypes.func,
  onAttachBottom: PropTypes.func,
  onDettachBottom: PropTypes.func,
  onContentLongerThanContainer: PropTypes.func,
  onNewMsgLayout: PropTypes.func
}