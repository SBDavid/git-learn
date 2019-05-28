const {ccclass, property} = cc._decorator;

@ccclass
export default class Coordinate extends cc.Component {

    private container: cc.Node;
    private labelInContainer: cc.Label;
    private labelOutOfContainer: cc.Label;

    onLoad() {
        this.container = this.node.getChildByName('container');
        this.labelInContainer = this.container.getChildByName('labelInContainer').getComponent(cc.Label);
        this.labelOutOfContainer = this.node.getChildByName('labelOutOfContainer').getComponent(cc.Label);

        console.info('labelInContainer 相对于 父节点的位置', this.container.getChildByName('labelInContainer').getPosition());
        console.info('labelOutOfContainer 相对于 父节点的位置', this.node.getChildByName('labelOutOfContainer').getPosition());
        const outOfworldPosition = this.node.convertToWorldSpaceAR(this.node.getChildByName('labelOutOfContainer').getPosition());
        console.info('labelOutOfContainer 相对于 世界的位置', outOfworldPosition);
        console.info('labelOUtOFContainer 相对于 labelinContainer的位置', this.container.getChildByName('labelInContainer').convertToNodeSpaceAR(outOfworldPosition));
    }

    start () {
        
    }

    // update (dt) {}
}
