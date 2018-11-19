
//var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

let app = new PIXI.Application({
    antialias: true,
    transparent: false,
    resolution: 1,

});

app.renderer.backgroundColor = 0x1099bb;
document.getElementById('game').appendChild(app.view);

let loader = PIXI.loader;
let reels, buttonBar;

loader
    .add("assets/BAR.png", "assets/BAR.png")
    .add("assets/2xBAR.png", "assets/2xBAR.png")
    .add("assets/3xBAR.png", "assets/3xBAR.png")
    .add("assets/7.png", "assets/7.png")
    .add("assets/Cherry.png", "assets/Cherry.png")
    .add("assets/reels-container.png", "assets/reels-container.png")
loader.load(init());

function init() {

    this.reels = new Reels(app);
    this.reels.setup();
}







