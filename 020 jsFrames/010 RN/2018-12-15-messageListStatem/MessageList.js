import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { ScrollView, TouchableOpacity, View, Keyboard, Text } from 'react-native'

const stateSet = {
  // 初始状态，组件还未显示在屏幕上
  init: 'init',
  // 不可滚动状态
  nonScroll: 'nonScroll',
  // 静止在底部附近
  stayAroundBottom: 'stayAroundBottom',
  // 静止在上部
  stayAwayFromBottom: 'stayAwayFromBottom',
  // 新消息超出底部
  stayBelowBottom: 'stayBelowBottom',
  // 在底部滚动
  scrollAroundBottom: 'scrollAroundBottom',
  // 在上部移动
  scrollAwayFromBottom: 'scrollAwayFromBottom',
  // 在底部拖拽
  dragAroundBottom: 'dragAroundBottom',
  // 在上部部拖拽
  dragAwayFromBottom: 'dragAwayFromBottom'
}

const actionSet = {
  // Scroll Layout
  LAYOUT: 'LAYOUT',
  // 插入消息
  ADD_MSG: 'ADD_MSG',
  // 消息从长度 > ScrollView高度
  Enable_Scroll: 'Enable_Scroll',
  DRAG_BEGIN: 'DRAG_BEGIN',
  DRAG_END_STAY: 'DRAG_END_STAY',
  DRAG_END_SCROLL: 'DRAG_END_SCROLL',
  SCROLL_BEGIN: 'SCROLL_BEGIN',
  SCROLL_END: 'SCROLL_END',
  ATTACH_BOTTOM: 'ATTACH_BOTTOM',
  DETTACH_BOTTOM: 'DETTACH_BOTTOM'
}

const machine = {
  [stateSet.init]: {
    [actionSet.LAYOUT]: stateSet.nonScroll
  },
  [stateSet.nonScroll]: {
    [actionSet.ADD_MSG]: stateSet.nonScroll,
    [actionSet.Enable_Scroll]: stateSet.stayAroundBottom
  },
  [stateSet.stayAroundBottom]: {
    [actionSet.ADD_MSG]: stateSet.stayBelowBottom,
    [actionSet.DRAG_BEGIN]: stateSet.dragAroundBottom
  },
  [stateSet.stayAwayFromBottom]: {
    [actionSet.SCROLL_BEGIN]: stateSet.scrollAwayFromBottom,
    [actionSet.DRAG_BEGIN]: stateSet.dragAwayFromBottom
  },
  [stateSet.stayBelowBottom]: {
    [actionSet.SCROLL_BEGIN]: stateSet.scrollAroundBottom,
  },
  [stateSet.scrollAroundBottom]: {
    [actionSet.SCROLL_END]: stateSet.stayAroundBottom,
    [actionSet.DETTACH_BOTTOM]: stateSet.scrollAwayFromBottom
  },
  [stateSet.scrollAwayFromBottom]: {
    [actionSet.SCROLL_END]: stateSet.stayAwayFromBottom,
    [actionSet.ATTACH_BOTTOM]: stateSet.scrollAroundBottom
  },
  [stateSet.dragAroundBottom]: {
    [actionSet.DRAG_END_STAY]: stateSet.stayAroundBottom,
    [actionSet.DRAG_END_SCROLL]: stateSet.scrollAroundBottom,
    [actionSet.DETTACH_BOTTOM]: stateSet.dragAwayFromBottom
  },
  [stateSet.dragAwayFromBottom]: {
    [actionSet.DRAG_END_STAY]: stateSet.stayAwayFromBottom,
    [actionSet.DRAG_END_SCROLL]: stateSet.scrollAwayFromBottom,
    [actionSet.ATTACH_BOTTOM]: stateSet.dragAroundBottom
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

    this.commends = {
      [stateSet.init]: {
        [actionSet.LAYOUT]: (payload) => {
          const evt = payload
          this.containerHeight = evt.nativeEvent.layout.height
        }
      },
      [stateSet.nonScroll]: {
        [actionSet.ADD_MSG]: null,
        [actionSet.Enable_Scroll]: (payload) => {
          this.props.onContentLongerThanContainer()
        }
      },
      [stateSet.stayAroundBottom]: {
        [actionSet.ADD_MSG]: (payload) => {
          const msg = payload
          this.addMsg(msg)
        },
        [actionSet.DRAG_BEGIN]: (payload) => {
          this.props.onScrollBegin()
        }
      },
      [stateSet.stayAwayFromBottom]: {
        [actionSet.SCROLL_BEGIN]: (payload) => {
          this.props.onScrollBegin()
        },
        [actionSet.DRAG_BEGIN]: (payload) => {
          this.props.onScrollBegin()
        }
      },
      [stateSet.stayBelowBottom]: {
        [actionSet.SCROLL_BEGIN]: (payload) => {
          this.props.onScrollBegin()
        },
      },
      [stateSet.scrollAroundBottom]: {
        [actionSet.SCROLL_END]: (payload) => {
          this.props.onScrollEnd()
        },
        [actionSet.DETTACH_BOTTOM]: (payload) => {
          this.props.onDettachBottom()
        }
      },
      [stateSet.scrollAwayFromBottom]: {
        [actionSet.SCROLL_END]: (payload) => {
          this.props.onScrollEnd()
        },
        [actionSet.ATTACH_BOTTOM]: (payload) => {
          this.props.onAttachBottom()
        }
      },
      [stateSet.dragAroundBottom]: {
        [actionSet.DRAG_END_STAY]: (payload) => {
          this.props.onScrollEnd()
        },
        [actionSet.DRAG_END_SCROLL]: null,
        [actionSet.DETTACH_BOTTOM]: (payload) => {
          this.props.onDettachBottom()
        }
      },
      [stateSet.dragAwayFromBottom]: {
        [actionSet.DRAG_END_STAY]: (payload) => {
          this.props.onScrollEnd()
        },
        [actionSet.DRAG_END_SCROLL]: null,
        [actionSet.ATTACH_BOTTOM]: (payload) => {
          this.props.onAttachBottom()
        }
      }
    }

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

    // console.info('transition', currentListState, action.type, nextListState)

    if (nextListState) {
      console.info('transition', currentListState, action.type, nextListState)
      this.command(currentListState, action)

      this.currentState = nextListState
    }
  }

  // 状态操作
  command(currentState, { type, payload }) {

    const action = this.commends[currentState][type]
    if (action) {
      action(payload)
    }

    /* switch (currentState) {
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
        } else if (type === 'DETTACH_BOTTOM') {
          this.props.onDettachBottom()
        }
        break
      case 'scrollAwayFromBottom':
        if (type === 'SCROLL_END') {
          this.props.onScrollEnd()
        } else if (type === 'ATTACH_BOTTOM') {
          this.props.onAttachBottom()
        }
        break
      case 'dragAroundBottom':
        if (type === 'DRAG_END_STAY') {
          this.props.onScrollEnd()
        }
        break
    } */
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