import Lazyimg from './Lazyimg';

var lazy = new Lazyimg({
    el: 'app',
    loading: 'http://static9.pplive.cn/mobile/msite/dist/assets/vertical_def.png',
    fadein: true, //是否开启淡入效果的全局选项
    nohori: false, //是否忽略横向懒加载的全局选项
    speed: 20, //对屏幕滚动的速度的阈值，滚动速度高于此值时，不加载图片
    srcparam: 'value'  //放置真是src的参数名
});