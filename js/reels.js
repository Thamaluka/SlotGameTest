class Reels {

    constructor(app) {
        this.game = app;
        var bg = PIXI.Sprite.fromImage('assets/reels-container.png');
        bg.height = 400;
        bg.width = 800;
        this.game.stage.addChild(bg);

        this.buttonBar = new ButtonBar(app);
        this.buttonBar.setup();


        this.running = false;

        this.reelMask = new PIXI.Graphics();
        this.reelMask.beginFill(0x000000, 0.6);
        this.reelMask.drawRect(0, 10, 800, 380);
        this.reelMask.endFill();

    }


    setup() {
        this.REEL_WIDTH = 265;
        this.SYMBOL_SIZE = 141;

        this.paylineTop = PIXI.Sprite.fromImage('assets/payline.png');
        this.paylineTop.position.y = this.SYMBOL_SIZE / 2;
        this.paylineTop.visible = false;

        this.paylineCenter = PIXI.Sprite.fromImage('assets/payline.png');
        this.paylineCenter.position.y = this.SYMBOL_SIZE + (this.SYMBOL_SIZE / 2);
        this.paylineCenter.visible = false;

        this.paylineBottom = PIXI.Sprite.fromImage('assets/payline.png');
        this.paylineBottom.position.y = this.SYMBOL_SIZE * 2 + (this.SYMBOL_SIZE / 2);
        this.paylineBottom.visible = false;

        this.game.stage.addChild(this.paylineTop);
        this.game.stage.addChild(this.paylineCenter);
        this.game.stage.addChild(this.paylineBottom);

        this.slotTextures = [
            { name: '3B', barfamily: true, url: PIXI.Texture.fromImage("assets/3xBAR.png") },
            { name: 'BAR', barfamily: true, url: PIXI.Texture.fromImage("assets/BAR.png") },
            { name: '2B', barfamily: true, url: PIXI.Texture.fromImage("assets/2xBAR.png") },
            { name: 'Seven', barfamily: false, url: PIXI.Texture.fromImage("assets/7.png") },
            { name: 'CH', barfamily: false, url: PIXI.Texture.fromImage("assets/Cherry.png") },
            { name: 'CH', barfamily: false, url: PIXI.Texture.fromImage("assets/Cherry.png") }//AUX SYMBOL,
        ];

        this.reels = [];
        this.reelContainer = new PIXI.Container();
        this.reelContainer.mask = this.reelMask;

        this.setSymbols();

        this.game.stage.addChild(this.reelContainer);
        var margin = -(this.SYMBOL_SIZE / 1.2);
        this.reelContainer.y = margin;


        this.buttonBar.buttonPlay.on('pointerdown', () => {
            this.startPlay();
        });

        this.game.ticker.add(() => { this.update() })

    }

    setSymbols() {
        for (var i = 0; i < 3; i++) {
            this.rc = new PIXI.Container();
            this.rc.x = i * this.REEL_WIDTH;
            this.reelContainer.addChild(this.rc);

            this.reel = {
                container: this.rc,
                symbols: []
            };

            for (var j = 0; j < this.slotTextures.length; j++) {
                var symbol = {
                    column: Number,
                    line: Number,
                    name: String,
                    symbol: new PIXI.Sprite,
                }

                var symbolTexture = new PIXI.Sprite(this.slotTextures[j].url);
                symbolTexture.y = j * this.SYMBOL_SIZE;
                symbolTexture.x = Math.round((this.SYMBOL_SIZE - symbolTexture.width) / 2);

                symbol.column = i;
                symbol.line = j;
                symbol.name = this.slotTextures[j].name;
                symbol.barfamily = this.slotTextures[j].barfamily;
                symbol.symbol = symbolTexture;

                this.reel.symbols.push(symbol);

                this.rc.addChild(symbol.symbol);
            }
            this.reels.push(this.reel);
        }

    }

    startPlay() {
        let reelCount = 0;
        let symbolCount = 0;

        let REEL_DELAY = setInterval(() => {
            reelCount++;
            this.start();
            if (reelCount == this.reels.length - 1)
                clearInterval(REEL_DELAY);
        }, 500);

        let REELS_STOP = setInterval(() => {
            this.running = false;
            clearInterval(REELS_STOP);
            this.checkWinningsPosition();
        }, 2000);


        this.start = (() => {
            for (let i = 0; i < this.reels[reelCount].symbols.length - 1; i++) {
                let previousSymbol;
                let atualSymbol = this.reels[reelCount].symbols[i];
                let netxSymbol = this.reels[reelCount].symbols[i + 1];

                if (i == 0) {
                    previousSymbol = this.reels[reelCount].symbols[this.reels[reelCount].symbols.length - 1];
                } else {
                    previousSymbol = this.reels[reelCount].symbols[i - 1];
                }
                this.running = true;
                this.moveSymbol(previousSymbol, atualSymbol, netxSymbol);
            }

        });
        this.start();
    }

    moveSymbol(previousSymbol, atualSymbol, netxSymbol) {
        let originalPosition = atualSymbol.symbol.position.y;

        let moving = setInterval(() => {
            if (atualSymbol.symbol.position.y < netxSymbol.symbol.position.y) {
                atualSymbol.symbol.position.y += 6.0;

            } else {
                netxSymbol.symbol.texture = atualSymbol.symbol.texture;
                netxSymbol.name = atualSymbol.name;
                netxSymbol.barfamily = atualSymbol.barfamily;

                atualSymbol.symbol.position.y = originalPosition;
                atualSymbol.symbol.texture = previousSymbol.symbol.texture;
                atualSymbol.name = previousSymbol.name;
                atualSymbol.barfamily = previousSymbol.barfamily;
                clearInterval(moving);

                if (this.running) {
                    let DELAY = setInterval(() => {
                        this.moveSymbol(previousSymbol, atualSymbol, netxSymbol);
                        clearInterval(DELAY);
                    }, 8);
                }
            }
        }, 10)
    }

    getSymbols() {
        let payLines = []
        let p = [];

        p.push(this.reels[0].symbols[0].name, this.reels[0].symbols[0].barfamily);
        p.push(this.reels[0].symbols[1].name, this.reels[0].symbols[1].barfamily);
        p.push(this.reels[0].symbols[2].name, this.reels[0].symbols[2].barfamily);

        payLines[0] = p;
        p = [];

        p.push(this.reels[1].symbols[0].name, this.reels[1].symbols[0].barfamily);
        p.push(this.reels[1].symbols[1].name, this.reels[1].symbols[1].barfamily);
        p.push(this.reels[1].symbols[2].name, this.reels[1].symbols[2].barfamily);
        payLines[1] = p;
        p = [];

        p.push(this.reels[2].symbols[0].name, this.reels[2].symbols[0].barfamily);
        p.push(this.reels[2].symbols[1].name, this.reels[2].symbols[1].barfamily);
        p.push(this.reels[2].symbols[2].name, this.reels[2].symbols[2].barfamily);
        payLines[2] = p;

        return payLines;
    }

    checkWinningsPosition() {
        let symbols = this.getSymbols();
        this.topPrize = false;
        this.centerPrize = false;
        this.bottomPrize = false;
        this.familyBar = false;
        this.cherrySeven = false;
        let symbolOnTop;
        let symbolOnCenter;
        let symbolOnBottom;

        if (symbols[0][0] === symbols[1][0] && symbols[0][0] === symbols[2][0] && symbols[1][0] === symbols[2][0]) { this.topPrize = true; symbolOnTop = symbols[0][0] }
        if (symbols[0][2] === symbols[1][2] && symbols[0][2] === symbols[2][2] && symbols[1][2] === symbols[2][2]) { this.centerPrize = true; symbolOnCenter = symbols[0][2] }
        if (symbols[0][4] === symbols[1][4] && symbols[0][4] == symbols[2][4] && symbols[1][4] === symbols[2][4]) { this.bottomPrize = true; symbolOnBottom = symbols[0][4] }

     
        if (symbols[0][1] && symbols[1][1] && symbols[2][1]) { this.familyBar = true; }
        if (symbols[0][3] && symbols[1][3] && symbols[2][3]) { this.familyBar = true; }
        if (symbols[0][5] && symbols[1][5] && symbols[2][5]) { this.familyBar = true; }


        this.checkPrizes(symbolOnTop, symbolOnBottom, symbolOnCenter);
    }

    checkPrizes(symbolOnTop, symbolOnBottom, symbolOnCenter) {

        this.checkSetPaytable = (() => {
            if (this.topPrize) { this.paytable(symbolOnTop); }
            if (this.centerPrize) { this.paytable(symbolOnCenter); }
            if (this.bottomPrize) { this.paytable(symbolOnBottom); }
        });


        this.paytable = ((symbolToPay) => {
            switch (symbolToPay) {
                case 'CH':
                    if (this.topPrize) { console.log("TOTAL WIN: " + 2000); }
                    if (this.centerPrize) { console.log("TOTAL WIN: " + 1000); }
                    if (this.bottomPrize) { console.log("TOTAL WIN: " + 4000); }
                    break;
                case 'Seven':
                    console.log("TOTAL WIN: " + 150);
                    break;
                case '3B':
                    console.log("TOTAL WIN: " + 50);
                    break;
                case '2B':
                    console.log("TOTAL WIN: " + 20);
                    break;
                case 'BAR':
                    console.log("TOTAL WIN: " + 10);
                    break;
            }
            if (symbolToPay == symbolOnTop) { this.topPrize = false; }
            if (symbolToPay == symbolOnCenter) { this.centerPrize = false }
            if (symbolToPay == symbolOnBottom) { this.bottomPrize = false }
            this.checkSetPaytable();
        });

        if (this.familyBar == true) { console.log("TOTAL WIN: " + 5); }
        if (this.cherrySeven == true) { console.log("TOTAL WIN: " + 75); }
        this.checkSetPaytable();

    }

    update() {
        this.buttonBar.buttonPlay.interactive = !this.running;
    }
}




