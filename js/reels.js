class Reels {

    constructor(app) {
        this.game = app;
        var bg = PIXI.Sprite.fromImage('assets/border.png');
        bg.height = 405;
        bg.width = 800;
        this.game.stage.addChild(bg);

        this.buttonBar = new ButtonBar(app);
        this.buttonBar.setup();


        this.running = false;
        this.isDebug = false;
        this.debugSymbols;

        this.reelMask = new PIXI.Graphics();
        this.reelMask.beginFill(0x000000, 0.6);
        this.reelMask.drawRect(0, 10, 800, 380);
        this.reelMask.endFill();

    }


    setup() {
        this.REEL_WIDTH = 265;
        this.SYMBOL_SIZE = 141;
        this.DELAY_START_REEL = 500;
        this.DELAY_STOP_REELS = 2000;
        this.DELAY_STOP_REEL = 500;
        this.DELAY_MOVE_SYMBOLS = 10;

        this.paylineTop = PIXI.Sprite.fromImage('assets/payline.png');
        this.paylineTop.position.y = this.SYMBOL_SIZE / 2 - 10;
        this.paylineTop.visible = false;

        this.paylineCenter = PIXI.Sprite.fromImage('assets/payline1.png');
        this.paylineCenter.position.y = this.SYMBOL_SIZE + (this.SYMBOL_SIZE / 2) - 10;
        this.paylineCenter.visible = false;

        this.paylineBottom = PIXI.Sprite.fromImage('assets/payline2.png');
        this.paylineBottom.position.y = this.SYMBOL_SIZE * 2 + (this.SYMBOL_SIZE / 2) - 10;
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
            if (this.buttonBar.balance > 0)
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
        this.paylineTop.visible = false;
        this.paylineCenter.visible = false;
        this.paylineBottom.visible = false;
        this.buttonBar.playBalance(1);
        this.buttonBar.clearTotalWin();
        this.reelCount = 0;

        this.REEL_DELAY = setInterval(() => {
            this.reelCount++;
            if (this.reelCount == this.reels.length - 1) {
                this.reelCount = 0;
                clearInterval(this.REEL_DELAY);
                this.start(this.thirdReel);
            } else {
                this.start(this.secondReel);
            }
        }, this.DELAY_START_REEL);

        let ALL_REELS_STOP = setInterval(() => {
            clearInterval(ALL_REELS_STOP);
            this.reelCount = 0;
            this.running = false;
            if (this.isDebug) {
                this.debug();
            } else
                this.checkWinningsPosition();
        }, this.DELAY_STOP_REELS);

        this.firstReel = { symbols: this.reels[0].symbols, moving: true };
        this.secondReel = { symbols: this.reels[1].symbols, moving: true };
        this.thirdReel = { symbols: this.reels[2].symbols, moving: true };

        this.start = ((reel) => {

            for (let i = 0; i < reel.symbols.length - 1; i++) {
                let previousSymbol;
                let atualSymbol = reel.symbols[i];
                let netxSymbol = reel.symbols[i + 1];

                if (i == 0) {
                    previousSymbol = reel.symbols[reel.symbols.length - 1];
                } else {
                    previousSymbol = reel.symbols[i - 1];
                }
                this.running = true;
                this.moveSymbol(previousSymbol, atualSymbol, netxSymbol, reel);
            }


        });
        this.start(this.firstReel);
    }

    debug() {
        this.running = true;

        if (this.firstReel.symbols[0].name == this.debugSymbols[0]) {
            this.firstReel.moving = false;
        }

        if (this.secondReel.symbols[0].name == this.debugSymbols[0] && this.firstReel.moving == false) {
            this.secondReel.moving = false;
        }

        if (this.thirdReel.symbols[0].name == this.debugSymbols[0] && this.firstReel.moving == false && this.secondReel.moving == false) {
            this.thirdReel.moving = false;
            this.running = false;
            this.isDebug = false;
            this.checkWinningsPosition();
        }
        if (this.running) {
            let DELAY = setInterval(() => {
                this.debug();
                clearInterval(DELAY);
            }, 50);
        }

    }

    moveSymbol(previousSymbol, atualSymbol, netxSymbol, reel) {
        let originalPosition = atualSymbol.symbol.position.y;

        if (this.running && reel.moving) {
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
                    let DELAY = setInterval(() => {
                        this.moveSymbol(previousSymbol, atualSymbol, netxSymbol, reel);
                        clearInterval(DELAY);
                    }, this.DELAY_MOVE_SYMBOLS);

                }
            }, this.DELAY_MOVE_SYMBOLS);
        }


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

        this.familyBarTop = false;
        this.familyBarCenter = false;
        this.familyBarBottom = false;

        this.cherrySevenBarTop = false;
        this.cherrySevenBarCenter = false;
        this.cherrySevenBarBottom = false;

        if (symbols[0][0] === symbols[1][0] && symbols[0][0] === symbols[2][0] && symbols[1][0] === symbols[2][0]) { this.topPrize = true; symbolOnTop = symbols[0][0] }
        if (symbols[0][2] === symbols[1][2] && symbols[0][2] === symbols[2][2] && symbols[1][2] === symbols[2][2]) { this.centerPrize = true; symbolOnCenter = symbols[0][2] }
        if (symbols[0][4] === symbols[1][4] && symbols[0][4] == symbols[2][4] && symbols[1][4] === symbols[2][4]) { this.bottomPrize = true; symbolOnBottom = symbols[0][4] }


        if (symbols[0][1] && symbols[1][1] && symbols[2][1]) { this.familyBar = true; this.familyBarTop = true; }
        if (symbols[0][3] && symbols[1][3] && symbols[2][3]) { this.familyBar = true; this.familyBarCenter = true; }
        if (symbols[0][5] && symbols[1][5] && symbols[2][5]) { this.familyBar = true; this.familyBarBottom = true; }

        if ((symbols[0][1] & 1) + (symbols[1][1] & 1) + (symbols[2][1] & 1) > 2) { this.cherrySevenBarTop = true; }
        if ((symbols[0][3] & 1) + (symbols[1][3] & 1) + (symbols[2][3] & 1) > 2) { this.cherrySevenBarCenter = true; }
        if ((symbols[0][5] & 1) + (symbols[1][5] & 1) + (symbols[2][5] & 1) > 2) { this.cherrySevenBarBottom = true; }


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
                    if (this.topPrize) { this.buttonBar.setWinnings(2000); }
                    if (this.centerPrize) { this.buttonBar.setWinnings(1000); }
                    if (this.bottomPrize) { this.buttonBar.setWinnings(4000); }
                case 'Seven':
                    this.buttonBar.setWinnings(150);
                    break;
                case '3B':
                    this.buttonBar.setWinnings(50);
                    break;
                case '2B':
                    this.buttonBar.setWinnings(20);
                    break;
                case 'BAR':
                    this.buttonBar.setWinnings(10);
                    break;
            }
            if (symbolToPay == symbolOnTop) { this.topPrize = false; this.blinkPayline(this.paylineTop) }
            if (symbolToPay == symbolOnCenter) { this.centerPrize = false; this.blinkPayline(this.paylineCenter) }
            if (symbolToPay == symbolOnBottom) { this.bottomPrize = false; this.blinkPayline(this.paylineBottom) }
            this.checkSetPaytable();
        });

        if (this.familyBar == true) {
            this.buttonBar.setWinnings(5);
            if (this.familyBarTop) { this.blinkPayline(this.paylineTop) }
            if (this.familyBarCenter) { this.blinkPayline(this.paylineCenter) }
            if (this.familyBarBottom) { this.blinkPayline(this.paylineBottom) }
        }
        if (this.cherrySeven == true) {
            this.buttonBar.setWinnings(75);
            if (this.cherrySevenBarTop) { this.blinkPayline(this.paylineTop) }
            if (this.cherrySevenBarCenter) { this.blinkPayline(this.paylineCenter) }
            if (this.cherrySevenBarBottom) { this.blinkPayline(this.paylineBottom) }
        }
        this.checkSetPaytable();

    }

    blinkPayline(payline) {
        payline.visible = true;
        let index = 0;

        let blinking = setInterval(() => {
            if (index % 2 == 0) {
                payline.visible = !payline.visible;
            }
            index++;
            if (index == 8) { clearInterval(blinking) }
        }, 100)

    }

    getDebugSymbol(value) {
        this.debugSymbols = value.split('|');
    }

    update() {
        this.buttonBar.buttonPlay.interactive = !this.running;
    }
}




