const {ccclass, property} = cc._decorator;

@ccclass
export default class VideoPlayer extends cc.Component {

    @property(cc.VideoPlayer)
    videoPlayer: cc.VideoPlayer = null;

    @property(cc.Button)
    play: cc.Button = null;

    @property(cc.Button)
    pause: cc.Button = null;

    @property(cc.Button)
    stop: cc.Button = null;

    @property(cc.Button)
    seek: cc.Button = null;

    @property(cc.Button)
    change: cc.Button = null;

    private isReady;
    private url = 'https://s1.xmcdn.com/video/dead.mp4';


    start () {

        const handler = new cc.Component.EventHandler();
        handler.target = this.node;
        handler.component = 'PlayVideo';
        handler.handler = 'handler';
        handler.customEventData = 'foo';


        this.videoPlayer.videoPlayerEvent.push(handler);

        // btn
        this.play.node.on('click', () => {
            if (this.isReady) {
                this.videoPlayer.play();
            }
        });
        this.pause.node.on('click', () => {
            this.videoPlayer.pause();
        });
        this.stop.node.on('click', () => {
            this.videoPlayer.stop();
        });

        this.seek.node.on('click', () => {
            console.info('当前时间', this.videoPlayer.currentTime);
            (this.videoPlayer as any)._impl._video.currentTime = 10;
        });

        this.change.node.on('click', () => {
            this.videoPlayer.resourceType = cc.VideoPlayer.ResourceType.REMOTE;
            this.videoPlayer.clip = this.url;
            console.info('url', this.videoPlayer.clip)
        });
    }

    handler(comp: cc.Component, eventType: cc.VideoPlayer.EventType, customEventData) {

        if (eventType === cc.VideoPlayer.EventType.META_LOADED) {
            console.info('META_LOADED');
            this.isReady = true;
            console.info('视频总长度', this.videoPlayer.getDuration());
            console.info('url', this.videoPlayer.clip);
        }

        if (eventType === cc.VideoPlayer.EventType.READY_TO_PLAY) {
            console.info('READY_TO_PLAY');
            this.isReady = true;
        }

        if (eventType === cc.VideoPlayer.EventType.PLAYING) {
            console.info('PLAYING');
        }

        if (eventType === cc.VideoPlayer.EventType.PAUSED) {
            console.info('PAUSED');
        }

        if (eventType === cc.VideoPlayer.EventType.STOPPED) {
            console.info('STOPPED');
        }

        if (eventType === cc.VideoPlayer.EventType.COMPLETED) {
            console.info('COMPLETED');
        }
    }
}
