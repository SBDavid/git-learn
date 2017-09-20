/**
 * @author [pelexiang]
 * @email [pelexiang@pptv.com]
 * @create date 2017-09-11 01:28:36
 * @modify date 2017-09-11 01:28:36
 * @desc [description]
 */

var em = require("./event-mouse-wheel");
var SHASH = {};
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
var PPScroller = function() {
    //自定义滚动轴
    $.fn.ppScroller = function(option) {
        var _this = $(this);
        var opt = $.extend({
            maxHeight: 0 // 容器高度
                ,
            maxWidth: 0 // 容器宽度
                ,
            horizontal: false // 纵向
                ,
            showScroller: true // 显示滚动轴
                ,
            wheelPixel: 8 // 滚动距离
                ,
            animate: false // 动画
                ,
            mouseWheel: true //鼠标滚轴事件
                ,
            autoWrap: false //自动包裹一层div
                ,
            slideBlockSelector: null //滑块选择器
                ,
            scrollerSelector: '.pp-scroller'
                ,
            onScroll: function(index, scroll, location) {}
        }, option);

        var _onScroll = opt.onScroll;
        var _a, _b, _range;
        /*最大宽度（高度）*/
        var max = !opt.horizontal ? opt.maxHeight || _this.height() : opt.maxWidth || _this.width();
        /**
         * [onScroll 滚动监听 - fix 负数问题]
         * @param  {[int]} a     [滚动序号]
         * @param  {[int]} b     [滚动距离]
         * @param  {[int]} range [可滚动距离]
         */
        opt.onScroll = function(a, b, range) {
            var a = parseInt(Math.abs(a));
            var b = parseInt(Math.abs(b));
            var range = Math.abs(b) === 0 ? 0 : (Math.abs(b) / range);
            if ((a !== _a || b !== _b || range !== _range) && !isNaN(a + b + range)) {
                _onScroll(a, b, range);
                _a = a;
                _b = b;
                _range = range;
            }
        }

        /* 动画处理 */
        var doChange = opt.animate ? function($obj, attr, v) {
            var a = {};
            a[attr] = v;
            $obj.stop()['animate'](a);
        } : function($obj, attr, v) {
            $obj['css'](attr, v);
        }
        return _this.each(function() {
            var Handler = {};
            var scrollHandler = $.Callbacks();
            var scroller = $(opt.scrollerSelector);
            var inner, $temp;

            /*添加scroll ID*/
            var sid = parseInt(Math.random() * 1000000);
            if (!_this.attr('data-scroller-sid')) {
                _this.attr('data-scroller-sid', sid);
            } else {
                sid = _this.attr('data-scroller-sid');
                SHASH[sid].destory();
            }
            SHASH[sid] = _this;

            /*添加class*/
            _this.addClass('pp-scroller-container');
            if (opt.horizontal) {
                _this.addClass('pp-scroller-container-h');
            }

            /*滑块选择器*/
            if (opt.slideBlockSelector) {
                inner = _this.find(opt.slideBlockSelector);
            } else {
                inner = _this.children(':first');
            }

            if (opt.autoWrap) {
                $temp = $('<div>').appendTo(_this);
                $temp.append(inner);
                inner = $temp;
            }

            inner.eq(0).css({
                position: 'relative'
            });

            /* 计算宽度 */
            if (opt.horizontal) {
                var width = 0;
                inner.children().each(function(i, n) {
                    width += $(n).outerWidth(true);
                });
                inner.width(width);
            }

            /* 移动端使用默认的滚动轴 */
            if (isMobile) {
                _this.height(max).css(!opt.horizontal ? {
                    overflowY: 'scroll',
                    overflowX: 'hidden'
                } : {
                    overflowX: 'scroll',
                    overflowY: 'hidden'
                });
                _this.scroll = _this.destory = this.pause = function() {
                    return _this
                };
                _this.scrollTo = function(xy, cb) {
                    var xy = parseInt(xy);
                    if (!opt.horizontal) {
                        _this.scrollTop(xy);
                    } else {
                        _this.scrollLeft(xy);
                    }
                    cb && cb();

                    return _this;
                };
                _this.scrollTo1 = function(i, cb) {
                    var xy = parseInt(opt.wheelPixel * i);
                    if (!opt.horizontal) {
                        _this.scrollTop(xy);
                    } else {
                        _this.scrollLeft(xy);
                    }

                    cb && cb();

                    return _this;
                };

                var scrollRange = !opt.horizontal ? inner.outerHeight() - max : inner.outerWidth() - max;
                var spaceing = parseInt(scrollRange / opt.wheelPixel); // 间隔数
                _this.on('scroll', function(e) {
                    opt.onScroll(parseInt(scrollRange / opt.wheelPixel), this.scrollTop, scrollRange);
                });
                return _this;
            }

            var
                offsetXY, // 鼠标按下按钮offset
                mouseXY, // 鼠标按下位置
                mkey = false, // 拖拽开关
                skey = false, // 初始化开关
                scale, // 容器 / 内容总宽高
                total, // 内容总宽高
                btn, // 滚动轴按钮
                btnWH,
                index = 0,
                scrollRange = !opt.horizontal ? inner.outerHeight() - max : inner.outerWidth() - max,
                spaceing = parseInt(scrollRange / opt.wheelPixel); // 间隔数

            /**
             * 垂直移动
             */
            var verticalMove = function() {
                var top = (-opt.wheelPixel * index);
                if (index > 0 || spaceing < 0) {
                    top = 0;
                    index = 0;
                } else if (-index > spaceing) {
                    top = -max + inner.outerHeight();
                    index = -spaceing;
                }
                doChange(btn, 'top', top * scale);
                doChange(inner, 'top', -top);
                opt.onScroll(index, top, scrollRange);
                return false;
            }

            /**
             * 水平移动
             */
            var horizontalMove = function() {
                var left = (-opt.wheelPixel * index)
                if (index > 0) {
                    left = 0;
                    index = 0;
                } else if (-index >= spaceing) {
                    left = -max + inner.outerWidth();
                    index = -spaceing;
                }

                doChange(btn, 'left', left * scale);
                doChange(inner, 'left', -left);

                opt.onScroll(index, left, scrollRange);
                return false;
            }

            /*
             * 鼠标滚轮
             */
            if (opt.mouseWheel) {
                Handler.container_mousewheel = !opt.horizontal ?
                    function(e, y) {
                        if (skey) {
                            index += y;
                            return verticalMove();
                        }
                    } : function(e, y) {
                        if (skey) {
                            index += y;
                            return horizontalMove();
                        }
                    }
                Handler.container_mousewheel_t = _this;
                _this.on('mousewheel', Handler.container_mousewheel);
            }

            /**
             * 滚动条按钮按下
             */
            Handler.btn_mousedown = !opt.horizontal ? function(e) {
                mkey = true;
                mouseXY = parseInt(e.pageY);
                offsetXY = parseInt($(this).position().top);
                return false;
            } : function(e) {
                mkey = true;
                mouseXY = parseInt(e.pageX);
                offsetXY = parseInt($(this).position().left);
                return false;
            };
            btn = scroller.find('div').on('mousedown', Handler.btn_mousedown);
            Handler.btn_mousedown_t = btn;

            /**
             * 滚动条按下
             */
            Handler.scroller_mousedown = !opt.horizontal ?
                function(e) {
                    mkey = true;
                    mouseXY = parseInt(e.pageY);
                    offsetXY = parseInt(mouseXY - scroller.offset().top - btnWH / 2);
                    $(document).trigger('mousemove', [e.pageY]);
                } : function(e) {
                    mkey = true;
                    mouseXY = parseInt(e.pageX);
                    offsetXY = parseInt(mouseXY - scroller.offset().left - btnWH / 2);
                    $(document).trigger('mousemove', [e.pageX]);
                };
            Handler.scroller_mousedown_t = scroller;
            scroller.appendTo(_this).on('mousedown', Handler.scroller_mousedown);
            Handler.document_mousemove = function(e, pageXY) {
                if (mkey) {
                    mousemoveHandler(parseInt((!opt.horizontal ? e.pageY : e.pageX) || pageXY));
                }
            };
            Handler.document_mousemove_t = $(document);
            Handler.document_mouseup = function(e) {
                mkey = false;
            };
            Handler.document_mouseup_t = $(document);
            Handler.document_selectstart = function(e) {
                if (mkey) {
                    e.preventDefault();
                }
            };
            Handler.document_selectstart_t = $(document);
            $(document).on('mousemove', Handler.document_mousemove)
                .on('mouseup', Handler.document_mouseup)
                .on('selectstart', Handler.document_selectstart);

            /**
             * 移动处理
             */
            var mousemoveHandler = !opt.horizontal ? function(pageY) {
                var btnOffset = offsetXY + pageY - mouseXY;
                if (btnOffset <= 0) {
                    btnOffset = 0;
                } else if (btnOffset + parseInt(btn.outerHeight()) >= max) {
                    btnOffset = max - btn.outerHeight();
                }
                index = -(btnOffset / scale / opt.wheelPixel);
                verticalMove();
            } : function(pageX) {
                var btnOffset = offsetXY + pageX - mouseXY;
                if (btnOffset <= 0) {
                    btnOffset = 0;
                } else if (btnOffset + parseInt(btn.outerWidth()) >= max) {
                    btnOffset = max - btn.outerWidth();
                }

                index = -(btnOffset / scale / opt.wheelPixel);
                horizontalMove();
            };

            /**
             * 更新滚动条slide，btn的宽高以及间隔 滚动范围
             * @param height 需要滚动的容器高度
             */
            _this.updata = function(height) {
                _this.height('auto');
                total = !opt.horizontal ? inner.height() : inner.width();
                max = height || max;
                scale = max / total;
                scrollRange = !opt.horizontal ? (inner.outerHeight() - max) : (inner.outerWidth() - max);
                spaceing = parseInt(scrollRange / opt.wheelPixel);
                if (total <= max) {
                    skey = false;
                    scroller.hide();
                    if (!opt.horizontal) {
                        _this.height(max)
                    } else {
                        _this.css('max-width', max)
                    }
                } else {
                    skey = true;
                    if (!opt.showScroller) {
                        scroller.css('visibility', 'hidden');
                    }
                    if (!opt.horizontal) {
                        _this.height(max).css("overflow", "hidden");
                        scroller.show().height(max - 10).find("div").height(max * scale - 10);
                    } else {
                        _this.css({
                            'max-width': max,
                            'overflow': 'hidden'
                        });
                        scroller.show().width(max).find('div').width(max * scale);
                    }
                }
                btnWH = !opt.horizontal ? btn.height() : btn.width();
            };

            /**
             * 滚动到某一位置
             * @param {Object} xy 位置
             * @param {Object} cb
             */
            _this.scrollTo = function(xy, cb) {
                _this.updata();
                var xy = parseInt(xy);
                if (xy <= 0 || total < max) {
                    xy = 0;
                } else if (xy >= total - max) {
                    xy = total - max
                }
                index = -(xy / opt.wheelPixel);
                doChange(btn, !opt.horizontal ? 'top' : 'left', xy * scale);
                doChange(inner, !opt.horizontal ? 'top' : 'left', -xy);
                opt.onScroll(index, -xy, scrollRange);
                cb && cb();

                return _this;
            };

            /**
             * 初始化滚动条
             */
            _this.scroll = (function() {
                return function() {
                    return _this.scrollTo(0);
                }
            })();

            /**
             * 滚动到某一间隔位置
             * @param {Object} i 间隔位置
             * @param {Object} cb
             */
            _this.scrollTo1 = function(i, cb) {
                _this.updata();

                var xy = parseInt(opt.wheelPixel * i);
                if (xy <= 0 || total < max) {
                    xy = 0;
                } else if (xy >= total - max) {
                    xy = total - max
                }
                doChange(btn, !opt.horizontal ? 'top' : 'left', xy * scale);
                doChange(inner, !opt.horizontal ? 'top' : 'left', -xy);
                opt.onScroll(i, -xy, scrollRange);
                cb && cb();

                return _this;
            };

            _this.pause = Handler.pause;

            _this.destory = function() {
                for (var n in Handler) {
                    if (!/_t$/.test(n) && Handler[n + '_t']) {
                        Handler[n + '_t'].off(n.replace(/.+_/, ''), Handler[n]);
                        Handler[n + '_t'] = null;
                        Handler[n] = null;
                    }
                }
                if (!opt.horizontal) {
                    _this.height('');
                } else {
                    _this.width('');
                }
                scroller.remove();
                // 增加事件销毁
            };

            _this.rebuild = function() {
                if (!opt.horizontal) {
                    total = inner.height();
                    scale = max / total;
                    scrollRange = inner.outerHeight() - max;
                    spaceing = parseInt(scrollRange / opt.wheelPixel);
                    if (total < max) {
                        scroller.hide();
                    } else {
                        scroller.show().find('div').height(max * scale - 10);
                    }
                } else {

                }
            };

            return _this;
        });
    }
}

//实例化
var instance;
module.exports = function() {
    if (!instance) {
        instance = new PPScroller();
        return instance;
    } else {
        return instance;
    }
}();