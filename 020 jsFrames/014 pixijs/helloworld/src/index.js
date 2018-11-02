import * as PIXI from 'pixi.js';
import scaleToWindow from 'scale-to-window-pixi/scaleCanvasToWindow';

/* let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
}

PIXI.utils.sayHello(type) */

//Create a Pixi Application
let app = new PIXI.Application({ width: 60, height: 80, antialias: true });

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

app.renderer.backgroundColor = 0x781639;


const getWindow = () => window;
const getDocument = () => document;
scaleToWindow(app.renderer.view, 'black', getWindow, getDocument );
window.addEventListener('resize', () => {
    scaleToWindow(app.renderer.view, 'black', getWindow, getDocument );
});

app.renderer.view.addEventListener('touchmove', (e) => {
    e.preventDefault();
})