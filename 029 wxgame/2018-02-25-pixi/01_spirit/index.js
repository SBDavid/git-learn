let app = new PIXI.Application({
    width: 256,
    height: 256,
    antialias: true,
    transparent: false, // default: false
    resolution: 1       // default: 1
});

let sprite = null;

PIXI.loader
    .add("./20160713222717872.png")
    .load(function () {
        sprite = new PIXI.Sprite(
            PIXI.loader.resources["./20160713222717872.png"].texture
        );



        app.stage.addChild(sprite);

        sprite.x = 50;
        sprite.y = 50;
        sprite.scale.x = 2;
        sprite.scale.y = 2;
        sprite.rotation = 0.5;
    });

window.onload = function () {
    document.body.appendChild(app.view);
    
}