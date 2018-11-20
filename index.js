this.HEIGHT = 600;
this.WIDTH = 800;

let app = new PIXI.Application({
    antialias: true,
    transparent: true,
    resolution: 1,

});

document.getElementById('game').appendChild(app.view);


let loader = PIXI.loader;
let reels, buttonBar;

loader
    .add("assets/BAR.png", "assets/BAR.png")
    .add("assets/2xBAR.png", "assets/2xBAR.png")
    .add("assets/3xBAR.png", "assets/3xBAR.png")
    .add("assets/7.png", "assets/7.png")
    .add("assets/Cherry.png", "assets/Cherry.png")
    .add("assets/layer.png", "assets/layer.png")
    .add("assets/border.png", "assets/border.png")
    .add("assets/payline.png", "assets/payline.png")
    .add("assets/payline1.png", "assets/payline1.png")
    .add("assets/payline2.png", "assets/payline2.png")
loader.load(init());

function init() {

    this.reels = new Reels(app);
    this.reels.setup();

}

function inputBalance(value) {
    if (value > 0 && value <= 5000)
        this.reels.buttonBar.winsBalance(parseInt(value));
}

function inputDebug(value) {
    this.reels.isDebug = true;
    this.reels.getDebugSymbol(value);
}









