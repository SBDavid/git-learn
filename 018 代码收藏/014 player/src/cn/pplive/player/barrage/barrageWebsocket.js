require('es6-promise').polyfill();
import fetchJsonp from 'fetch-jsonp';
import 'whatwg-fetch';
import {Ajax} from './ajax';
//获取websocket的地址
const getWebsocketUrl=(url)=>{
    return fetchJsonp(url,{
        jsonpCallback:'jsonp',
        timeout: 10000
    })
}
const linkWebsocket=(url)=>{
}
//获取websocket的连接的请求地址
let getWayUrl = 'http://10.200.20.51:19704/ws';
//websocket的连接地址
let websocketUrl = '';
/**
 * 弹幕的wesocket接连SDK
 * opt {
 *  sub: 订阅的tag
 *  getWayUrl:获取websockect请求的地址
 *  onReady: 组件初始化好之后的回调
 *  onopen: 成功连接的回调
 *  onmessage：接收到消息的回调
 *  onclose：关闭连接的回调
 *  onerror：连接出错的回调
 * }
 *
 * @method open 打开链接
 * @method close 关闭链接
 * @method subscribe 订阅topic
 * @method unSubscribe 取消订阅topic
 */
export class BarrageWebsocket{
    constructor(opt={}){
        this.option = opt;
        if(!window.WebSocket){
            new Error('您当前的浏览器不支持websocket,请更换浏览器');
        }
        if(!opt.sub){
            new Error('订阅标签配置项 sub 为必选项');
        }
        this.vaersion = process.env.VERSION;
        this.init(opt)
    }
    init(opt){
        //websocket的连接地址
        getWayUrl = opt.getWayUrl || getWayUrl;
        getWebsocketUrl(getWayUrl).then(resp=>{
            return resp.json()
        }).then(json=>{
            console.log(json)
            if(json.Code == 1){
                websocketUrl = `ws://${json.Ip}/ws`;
                //组件初始化完成
                opt.onReady && opt.onReady.call(this);
                //opt.onopen && opt.onopen.call(this);
            }else{
                new Error('获取websocket连接地址错误');
            }
        }).catch(ex=>{
            console.log(ex);
            new Error('获取websocket连接地址错误');
        })
    }
    open(sub){
        if(!this.instance && websocketUrl){
            this.instance = new WebSocket(websocketUrl);
            this.instance.binaryType = 'arraybuffer';
            this.instance.onopen = ()=>{
                this.option.onopen && this.option.onopen();
                this.subscribe(sub)
            }
            this.instance.onmessage = (messageEvent)=>{
                var data = messageEvent.data;
                console.log('aaaaa')
                //字符串为弹慕信息
                if(typeof data == 'string'){
                    var tempIndex = data.indexOf('{');
                    var messageId = data.substring(data.indexOf('$')+1,tempIndex)
                    var barrage = JSON.parse(data.substring(tempIndex));
                    var message = {
                        type:'barrage',
                        tag:barrage.name,
                        msgid:messageId,
                        msg:barrage.contents
                    }
                    this.option.onmessage && this.option.onmessage(message);
                }else{
                    //消息信息
                    var uInt8Array = new Uint8Array(data);
                    var d = '';
                    for(var i=1;i<uInt8Array.length;i++){
                        d+=String.fromCharCode(uInt8Array[i])
                    }
                    var msg = ''
                    if(uInt8Array[0]==1){
                        msg='订阅成功';
                    }else if(uInt8Array[0] ==2){
                        msg='取消订阅成功';
                    }
                    var message = {
                        type:'message',
                        content:d+':'+msg
                    }
                    this.option.onmessage && this.option.onmessage(message);
                }
            }
            this.instance.onclose = ()=>{
                this.option.onclose && this.option.onclose();
                this.instance = null;
            }
            this.instance.onerror = ()=>{
                this.option.onerror && this.option.onerror();
                this.instance = null;
            }
        }
    }
    sendMsg(message){
        //let ajax = new Ajax();
        //ajax.ajax({
        //    type: 'POST',
        //    url: this.option.postUrl,
        //    //contentType: "application/json",
        //    data: message,
        //    dataType: 'json'
        //})

        fetch(this.option.postUrl,{
            method: 'POST',
            //mode: 'no-cors',
            body: JSON.stringify(message)
        }).then(function(body) {
        });


        //var headers = new Headers();
        //headers.append('Accept', 'application/json');
        //var request = new Request(this.option.postUrl, {headers: headers,method: 'POST'});
        //
        //fetch(request).then(function(response) {
        //    console.log(response.headers);
        //});
    }
    close(){
        if(this.instance){
            this.instance.close();
            this.instance = null;
        }
    }
    subscribe(tag){
        if(!tag){
            return;
        }
        console.log('asjdkasj')
        if(this.instance){
            console.log(tag)
            var tagsArray = tag.split('');
            var ut8Array = tagsArray.map(function (chart) {
                return chart.charCodeAt();
            });
            //1是订阅
            ut8Array.unshift(1);
            var msg = new Uint8Array(ut8Array);
            this.instance.send(msg.buffer);
        }
    }
    unSubscribe(tag){
        if(!tag){
            return;
        }
        if(this.instance){
            var tagsArray = tag.split('');
            var ut8Array = tagsArray.map(function (chart) {
                return chart.charCodeAt();
            });
            //2是取消订阅
            ut8Array.unshift(2);
            var msg = new Uint8Array(ut8Array);
            this.instance.send(msg.buffer);
        }
    }
}



//var config = { w: 800, h: 600, container: '#ad-box'}//具体参数由广告部门提供，需要什么我们传什么
//var h5WebAdPlayer = new h5AdPlayer();
//h5WebAdPlayer.initAd(config); //初始参数配置
//h5WebAdPlayer.showAd(id); //触发展示广告
//h5WebAdPlayer.hideAd(id);    //隐藏（删除？这块看下）广告
//h5WebAdPlayer.setAdVolume(num);  //设置音量
//var viewPort = {  w: 1000,h: 800 };
//h5WebAdPlayer.setViewport(viewPort); //重新设定视窗大小
//console.log('广告播放器版本号：  ==== ',h5WebAdPlayer.getVersion(),' ====');
//
////所有的事件调用
//h5WebAdPlayer.on('ikan_play',cb)/h5WebAdPlayer.on('ikan_error',cb)
