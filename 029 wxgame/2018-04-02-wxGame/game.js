import './js/libs/weapp-adapter'
import './js/libs/symbol'

import Main from './js/main'
/* import { canvas } from './js/libs/weapp-adapter';

new Main() */

var boomAudio = new Audio()
boomAudio.src = 'audio/boom.mp3';
boomAudio.play();

document.addEventListener('touchstart', function () {
    console.info('touchstart');
    boomAudio.currentTime = 0
    boomAudio.play();
});

var img = wx.createImage();
img.src = 'images/bg.jpg';

var ctx = canvas.getContext('2d');

img.onload = function() {
    console.info('onload');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
}

