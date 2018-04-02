import './js/libs/weapp-adapter'
import './js/libs/symbol'

import Main from './js/main'
import { canvas } from './js/libs/weapp-adapter';

// new Main()

var boomAudio     = new Audio()
boomAudio.src = 'audio/offline-sound-hit.mp3';
boomAudio.play();

document.addEventListener('touchstart', function() {
    boomAudio.currentTime = 0
    boomAudio.play();
});

setInterval(function() {
    boomAudio.currentTime = 0
    boomAudio.play();
}, 1000);

var img     = new Image()
img.src = './images/bg.jpg';

console.info(canvas)

var ctx = canvas.getContext('2d')
