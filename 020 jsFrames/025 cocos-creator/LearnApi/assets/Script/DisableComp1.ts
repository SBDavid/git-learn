const {ccclass, property} = cc._decorator;

@ccclass
export default class DisableComp1 extends cc.Component {

    @property(cc.Button)
    pic: cc.Button = null;

    onLoad () {
        this.pic.node.on('click', () => {
            this.enabled = !this.enabled;
        }, this)
    }

    start () {
        
    }

    update (dt) {
        console.info('DisableComp1 update')
        this.pic.node.x++;
    }
}
