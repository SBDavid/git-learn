/**
 * Created by chunbolv on 2017/7/24.
 */

/*
* {
*   speed: 1    速度
*   fontSize:'30px'   字体大小
*   fontFamily:'serif'  字体
*   dom: document.getElementById("aaa") canvas画布dom！！！必填
* }
* */

export class ShowBarrage{
    constructor() {
        this.width = 0; //画布宽度
        this.height = 0;    //画布高度
        this.speed = 0; //移动速度
        this.fontSize = ''; //字体大小
        this.fontFamily = '';   //字体设置
        this.font = ''; //用于画布字体设置
        this.c = undefined; //画布对象
        this.bgColor = '';  //每条弹幕背景
        this.fontColor = '';    //弹幕字体颜色
        this.renderData = [];   //正在渲染的数据池
        this.data = []; //未渲染数据储蓄池
        this.onOff = false;
        this.txt = undefined;
        this.roadArr = [];  //弹道选择器
        this.roadHei = 0;   //弹道高度
        this.fps = 30;  //设置速度
        this.paused = false;    //暂停
        this.img = undefined;
        this.myReq = null;
    }
    init(opt){
        this.speend = opt.speed || 1;
        this.fontSize = opt.fontSize || '30px';
        this.fontFamily = opt.fontFamily || 'serif';
        this.font = this.fontSize + ' ' + this.fontFamily;
        this.txt = opt.txt;
        this.c = opt.dom[0];
        this.opacity = opt.opacity || 0.4;
        this.fps = opt.fps || 30;
        this.ctx = this.c.getContext('2d');
        this.width = this.c.width;
        this.height = this.c.height;
        this.roadHei = parseInt(this.fontSize) * 1.2;
        this.roadArr = Array.from({length:parseInt(this.height/this.roadHei)}, (v,k) => [true,{}]);
        this.bgColor = opt.bgColor || 'rgba(0,0,0,0.1)';
        this.fontColor = opt.fontColor || '#666';
        this.data = [];
        this.renderData = [];
        this.paused = false;
        this.img = new Image();
        this.img.src = './ui.png';
        this.count = 0;
        this._requestAnimationFrame();
        this.myReq = requestAnimationFrame(this._checkData.bind(this));
    }
    _checkData(){
        this.ctx.font = this.font;
        this.ctx.textBaseline = 'middle';
        this.roadArr.forEach((item,i) => {
            if(item[0] && item[1][this.txt]){
                this.renderData.push(item[1]);
                item[0] = false;
                item[1] = {};
            }
            if(!item[1][this.txt] && this.data[0]){
                this.data[0].index = i;
                this.data[0].x = this.width;
                this.data[0].add = true;
                this.data[0].hei = parseInt(this.fontSize) * 1.1;
                item[1] = $.extend({},this.data[0]);
                this.data.splice(0,1);
            }
        })
        this._render();
    }
    _render(){
        this.ctx.clearRect(0,0,this.width,this.height);
        for(let index = 0;index < this.renderData.length;index++) {
            this.ctx.globalAlpha = this.opacity;
            let opt = this.renderData[index];
            opt.txt = opt[this.txt];
            opt.wid = this.ctx.measureText(opt.txt).width;
            opt.y = opt.index * this.roadHei + parseInt(this.fontSize) * 0.05;
            //this.ctx.fillStyle = this.fontColor;
            this.ctx.fillStyle = opt.color;
            this.ctx.fillText(opt.txt,opt.x,opt.y+15);
            this.ctx.globalAlpha = 1;
            if(opt.isYearVip) { //是否是会员，显示vip图片
                this._getImg(opt.x - 41,opt.y+5,20,10);
            }
            if(this.roadArr[opt.index] && this.roadArr[opt.index][0] == false && opt.add && (opt.x +opt.wid + opt.hei) * (30 * this.fps)/(opt.wid + opt.hei + this.width) < (this.width - opt.wid) * (30 * this.fps)/(this.ctx.measureText(this.roadArr[opt.index][1][this.txt]).width + opt.hei + this.width)) {
                this.roadArr[opt.index][0] = true;
                opt.add = false;
            }
            if(opt.x < - opt.wid - 0.5*opt.hei){
                this.renderData.splice(index,1);
            }
            opt.x -= (opt.wid + opt.hei + this.width)/(30 * this.fps);
        }
        if(!this.paused) {
            this.myReq = requestAnimationFrame(this._checkData.bind(this));
        }
    }
    _getImg(a,b){
        this.ctx.drawImage(this.img,a,b);
    }
    reload(data){
        this.data = this.data.concat(data);
    }
    resize(){
        this.width = this.c.width;
        this.height = this.c.height;
        console.log(this.roadArr.length < parseInt(this.height/this.roadHei))
        if(this.roadArr.length > parseInt(this.height/this.roadHei)){
            this.roadArr.length = parseInt(this.height/this.roadHei)
        }else if(this.roadArr.length < parseInt(this.height/this.roadHei)) {
            let temp = Array.from({length:parseInt(this.height/this.roadHei) - this.roadArr.length}, (v,k) => [true,{}]);
            this.roadArr = this.roadArr.concat(temp);
        }
        console.log(this.ctx.font)
    }
    //暂停
    pauseFun(){
        this.paused = !this.paused;
        if(!this.paused) {
            this.myReq = requestAnimationFrame(this._checkData.bind(this));
        } else {
            window.cancelAnimationFrame(this.myReq);
        }
    }
    //帧动画
    _requestAnimationFrame() {
        let requestAnimationFrame = window.requestAnimationFrame;
        if (!requestAnimationFrame) {
            requestAnimationFrame = (cb)=>{
                let currTime = new Date().getTime(),
                    lastTime = 0;
                let delayTime = Math.max(0, 16 - (currTime - lastTime));
                let id = setTimeout(()=>{
                    cb(currTime + delayTime);
                }, delayTime);
                lastTime = currTime + delayTime;
            }
        }
        window.requestAnimationFrame = requestAnimationFrame;
    }
}
