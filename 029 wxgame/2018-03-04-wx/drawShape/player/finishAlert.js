export default class FinishAlert {
    constructor(ctx) {
        this.screenCtx = ctx;
        this.globalCfg = GameGlobal.globalCfg;
    }

    alert(step, time, cb) {
        // 背景
        this.screenCtx.fillStyle = "rgba(0, 0, 0, 0.8)";
        this.screenCtx.fillRect(0, 0, this.globalCfg.screenW, this.globalCfg.screenH);

        // 线框
        const boxMargin = Math.floor(this.globalCfg.screenW * 0.1);
        const boxWidth = this.globalCfg.screenW - 2 * boxMargin;
        var rect = this.Rect(boxMargin, 100, boxWidth, 180);  
        this.drawRoundedRect(rect, 25);  
  
        // 文字
        this.screenCtx.font="30px Arial";
        this.screenCtx.fillStyle = "white";
        const textWidth = this.screenCtx.measureText("挑战成功").width;
        const textMargin = Math.floor((this.globalCfg.screenW - textWidth) / 2);
        this.screenCtx.fillText("挑战成功", textMargin, 150);

        // 步数
        const stepMargin = boxMargin*2;
        this.screenCtx.font="24px Arial";
        this.screenCtx.fillStyle = "white";
        this.screenCtx.fillText("步数：" + step, stepMargin, 200);

        // 用时
        const timeMargin = boxMargin*2;
        this.screenCtx.font="24px Arial";
        this.screenCtx.fillStyle = "white";
        let second = time / 1000;
        this.screenCtx.fillText("用时：" + second + '秒', stepMargin, 240);

        // 在玩一局
        const againBoxMargin = Math.floor(this.globalCfg.screenW * 0.25);
        const againBoxWidth = this.globalCfg.screenW - 2 * againBoxMargin;
        var againRect = this.Rect(againBoxMargin, 350, againBoxWidth, 50);  
        this.drawRoundedRect(againRect, 25);
        // 文字
        this.screenCtx.font="30px Arial";
        this.screenCtx.fillStyle = "white";
        const againTextWidth = this.screenCtx.measureText("再玩一局").width;
        const againTextMargin = Math.floor((this.globalCfg.screenW - againTextWidth) / 2);
        this.screenCtx.fillText("再玩一局", againTextMargin, 385);

        // 点击事件
        let touchEndHandler = function() {
            cb();
            wx.offTouchEnd(touchEndHandler);
        }
        wx.onTouchEnd(touchEndHandler);
    }

    Rect(x, y, w, h) {  
        return {x:x, y:y, width:w, height:h};  
    }  

    drawRoundedRect(rect, r) {
        this.screenCtx.strokeStyle = "white";
        this.screenCtx.lineWidth = 5;
        var Point = function(x, y) {  
            return {x:x, y:y};  
        };  

        var ptA = Point(rect.x + r, rect.y);  
        var ptB = Point(rect.x + rect.width, rect.y);  
        var ptC = Point(rect.x + rect.width, rect.y + rect.height);  
        var ptD = Point(rect.x, rect.y + rect.height);  
        var ptE = Point(rect.x, rect.y);  
          
        this.screenCtx.beginPath();  
          
        this.screenCtx.moveTo(ptA.x, ptA.y);  
        this.screenCtx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);  
        this.screenCtx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);  
        this.screenCtx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);  
        this.screenCtx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);  
      
        this.screenCtx.stroke();  
    }  
}