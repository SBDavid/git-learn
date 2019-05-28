// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    onLoad() {
        this.label.string = 'start';
        cc.loader.loadRes('pic', cc.SpriteFrame, (err, spriteFrame) => {
            if (err) {
                this.label.string = 'error';
                cc.error(err.message || err);
            } else {
                // cc.log('Result should be a sprite frame: ' + (spriteFrame instanceof cc.SpriteFrame));
                this.label.string = 'success';
                this.sprite.spriteFrame = spriteFrame;
            }
        });
    }

    start () {
        
    }

    // update (dt) {}
}
