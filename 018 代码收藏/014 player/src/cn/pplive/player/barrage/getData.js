/**
 * Created by chunbolv on 2017/7/24.
 */


/*
* {
*   type: 'live' /  'vod'   类型，live为直播，vod为点播,自定义类型不用填
*   pos: 0  当前弹幕的结束时间点，请求弹幕的数据中获取该值，也作为下次请求弹幕pos参数未赋值前，默认值为0，一般间隔时间为0.1s
*   ts: 0.1 间隔时间
* }
* */
class getData{

    constructor(){
        //播放类型
        this.type = '';
        //获取弹幕地址
        this.api = {
            'live': '//livecdn.danmu.pptv.com/danmu/v1/{platform}/ref/{ref_name}/danmu?appplt=web&appver={appver}&pos={pos}',
            'vod': '//apicdn.danmu.pptv.com/danmu/v2/{platform}/ref/{ref_name}/danmu?pos={pos}'
        };
        //平台类型
        this.platform = 'pplive';
        //当前弹幕的结束时间点，请求弹幕的数据中获取该值，也作为下次请求弹幕pos参数未赋值前，默认值为0，一般间隔时间为0.1s
        this.pos = 0;
        //间隔时间
        this.ts = 0.1;
        //版本号
        this.barrageVersion = '';
        //弹幕接口
        this.link = '';
        //弹幕数据
        this.data = {}
    }
    init(opt) {
        let self = this;
        self.type = opt.type || '';
        if(self.type != '') {
            self.link = self.api[self.type];
        } else {
            self.data.text = '';
        }
    }
    //数据结构整理
    dataStructure(opt){
        let self = this;
        switch (self.type) {
            case '':
                break;
            case 'live':

                break;
            case 'vod':
                break;
        }
    }

}
var m = new getData();
console.log(m)









