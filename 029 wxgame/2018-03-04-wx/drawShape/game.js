import Square from "./maze/square";
import {SquareData} from "./maze/squareData";
import GlobalCfg from "./config/global";
import index from "./player/index";
var screemCanvas = wx.createCanvas();
var screemCtx = screemCanvas.getContext('2d');

let globalCfg = GameGlobal.globalCfg = new GlobalCfg(screemCanvas);

// 绘制状态区域
screemCtx.fillStyle = '#f6f7f8';
screemCtx.fillRect(0, 0, globalCfg.screemW, globalCfg.statusContH);

// 初始化地图
var player = new index(screemCtx, Square, SquareData.no2);
player.start();



