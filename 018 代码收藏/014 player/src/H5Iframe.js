/**
 * ...
 * @author minliang1112@foxmail.com
 */
import { WinH5Player } from './H5Player';
import { CommonUI } from "view/component/CommonUI";

ppliveplayer.SharePlayer = function(config, plbox) {
    if (window.parent == window) {
        CommonUI.initError('仅支持Iframe嵌入播放！！');
        return;
    }
    ppliveplayer.sharePlayer = new (WinH5Player())(config, plbox);
}