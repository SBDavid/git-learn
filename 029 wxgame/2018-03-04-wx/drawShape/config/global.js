export default class  GlobalCfg {
    constructor(screemCanvas) {
        this.screenW = screemCanvas.width;
        this.screenH = screemCanvas.height;

        this.statusContH = 70;
        this.mazeContH = this.screenW;
    }
}