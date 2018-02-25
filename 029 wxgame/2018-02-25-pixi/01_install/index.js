let app = new PIXI.Application({
    width: 256,
    height: 256,
    antialias: true,
    transparent: false, // default: false
    resolution: 1       // default: 1
});

window.onload = function() {
    document.body.appendChild(app.view);
    app.renderer.backgroundColor = 0x999999;
}