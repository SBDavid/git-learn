import * as blur from 'stackblur-canvas';

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    src: cc.Sprite = null;

    @property(cc.Sprite)
    target: cc.Sprite = null;

    camera: cc.Camera = null;

    start() {
        this.camera = this.node.getComponentInChildren(cc.Camera);
        let texture = new cc.RenderTexture();
        texture.initWithSize(960, 640);

        const originTarget = this.camera.targetTexture;

        this.camera.targetTexture = texture;
        this.camera.render(this.node);
        this.camera.targetTexture = originTarget;

        let data = null;
        data = texture.readPixels(data, 0,0,480, 640);

        // revert
        const revertData = new Uint8Array(480 * 640 * 4);
        for (let x = 0; x < 480; x++) {
            for (let y = 0; y < 640; y++) {
                for (let z = 0; z < 640; z++) {

                    revertData[(639-y)*480*4 + x*4 + z] = data[y*480*4 + x*4 + z];
                }
            }
        }

        // blur
        const blurData = blur.imageDataRGBA({
            data: new Uint8ClampedArray(revertData),
            width: 480,
            height: 640
        }, 0, 0, 480, 640, 10);

        let tex = new cc.Texture2D();
        tex.initWithData(new Uint8Array(blurData.data), texture.getPixelFormat(), 480, 640);
        let spriteFrame = new cc.SpriteFrame(tex);
        this.target.spriteFrame = spriteFrame;
    }
}
