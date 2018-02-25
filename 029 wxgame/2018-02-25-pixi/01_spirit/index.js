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

        function move(d) {
            sprite.x += 1;
            console.info(d);
            if (sprite.x === 200) {
                app.ticker.remove(move);
            }
        }

        app.ticker.add(move);
    });

window.onload = function () {
    document.body.appendChild(app.view);
    
}