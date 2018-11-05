import * as PIXI from 'pixi.js';
import scaleToWindow from 'scale-to-window-pixi/scaleCanvasToWindow';
import keyboard from './keyboard';
import hitTestRectangle from './hitTestRectangle';
/* let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
}

PIXI.utils.sayHello(type) */

//Create a Pixi Application
let app = new PIXI.Application({ width: 600, height: 800, antialias: true });

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

app.renderer.backgroundColor = 0x781639;


const getWindow = () => window;
const getDocument = () => document;
scaleToWindow(app.renderer.view, 'black', getWindow, getDocument);
window.addEventListener('resize', () => {
    scaleToWindow(app.renderer.view, 'black', getWindow, getDocument);
});

app.renderer.view.addEventListener('touchmove', (e) => {
    e.preventDefault();
})

// 加载图片
PIXI.loader
    .add(["asset/pixijs-v4-logo-sml.png", "asset/09.png"])
    .on('progress', (loader, res) => {
        //console.info(loader, res)
    })
    .load(setup);

function setup() {
    let sprite = new PIXI.Sprite(
        PIXI.loader.resources["asset/09.png"].texture
    );

    // 旋转动画
    /* app.stage.addChild(sprite);

    sprite.x = (app.renderer.view.width) / 2;
    sprite.y = (app.renderer.view.height) / 2;

    sprite.pivot.set(sprite.width/2, sprite.height/2);

    setInterval(() => {
        sprite.rotation += 2/360;
    }, 16) */

    let texture = PIXI.utils.TextureCache["asset/09.png"];
    let retangle = new PIXI.Rectangle(0, 0, 32, 32);
    texture.frame = retangle;
    let cat = new PIXI.Sprite(texture);
    cat.scale.set(4, 4);
    app.stage.addChild(cat);
    console.info('cat size', cat.width, cat.height)

    // 绘制一个矩形
    let rectangle = new PIXI.Graphics();
    rectangle.lineStyle(4, 0xFF3300, 1);
    rectangle.beginFill(0x66CCFF);
    rectangle.drawRect(0, 0, 64, 64);
    rectangle.endFill();
    rectangle.x = 300;
    rectangle.y = 400;
    app.stage.addChild(rectangle);

    //Capture the keyboard arrow keys
    let left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    //Left arrow key `press` method
    left.press = () => {
        //Change the cat's velocity when the key is pressed
        console.info('left');
        cat.x -= 5;
        if (hitTestRectangle(cat, rectangle)) {
            console.info('hit');
        }
    };

    //Up
    up.press = () => {
        console.info('up');
        cat.y -= 5;
        if (hitTestRectangle(cat, rectangle)) {
            console.info('hit');
        }
    };

    //Right
    right.press = () => {
        console.info('Right');
        cat.x += 5;
        if (hitTestRectangle(cat, rectangle)) {
            console.info('hit');
        }
    };

    //Down
    down.press = () => {
        console.info('Down');
        cat.y += 5;
        if (hitTestRectangle(cat, rectangle)) {
            console.info('hit');
        }
    };
}