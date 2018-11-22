class ButtonBar {

    constructor(app) {

        this.game = app;
        var bg = PIXI.Sprite.fromImage('assets/layer.png');
        bg.position.y = 420;
        this.game.stage.addChild(bg);

        this.inputBalance = document.getElementById('balance');
    }

    setup() {

        this.buttonPlay = PIXI.Sprite.fromImage('assets/buttonPlay.png');
        this.buttonPlay.height = 100;
        this.buttonPlay.width = 100;
        this.buttonPlay.anchor.set(0.5);
        this.buttonPlay.position.x = 800 - this.buttonPlay.width;
        this.buttonPlay.position.y = (600 / 2) * 2 - (this.buttonPlay.height);
        this.buttonPlay.interactive = true;
        this.buttonPlay.buttonMode = true;

        this.style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            wordWrap: true,
            wordWrapWidth: 440,
            fill: ['#FFFF00'],

        });

        this.style2 = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 30,
            fontWeight: 'bold',
            dropShadowAngle: Math.PI / 6,
            wordWrap: true,
            wordWrapWidth: 440,
            fill: ['#FFFFFF'],
            align: 'center',
        });


        this.totalWin = 0;
        this.balance = 50;

        this.totalWinText = new PIXI.Text('€ 0', this.style2);

        this.balanceText = new PIXI.Text('€ ' + this.balance, this.style2);

        this.cashLabelTxt = new PIXI.Text('WINS ', this.style);
        this.balanceLabelTxt = new PIXI.Text('BALANCE ', this.style);

        this.totalWinText.x = 150;
        this.totalWinText.y = 460;


        this.balanceText.x = 400;
        this.balanceText.y = 460;

        this.cashLabelTxt.x = 150;
        this.cashLabelTxt.y = this.buttonPlay.y;

        this.balanceLabelTxt.x = 400;
        this.balanceLabelTxt.y = this.buttonPlay.y;



        this.game.stage.addChild(this.buttonPlay);
        this.game.stage.addChild(this.cashLabelTxt);
        this.game.stage.addChild(this.balanceLabelTxt);
        this.game.stage.addChild(this.totalWinText);
        this.game.stage.addChild(this.balanceText);

    }

    setWinnings(value) {
        this.totalWin += value;
        this.totalWinText.text = ("€ " + this.totalWin);
        if (this.totalWin > 0) {
            this.winsBalance(value);
        }
    };

    clearTotalWin() {
        this.totalWin = 0;
        this.totalWinText.text = ("€ " + this.totalWin);
    }

    playBalance(value) {
        this.balance -= value;
        this.balanceText.text = ("€ " + this.balance);
    };

    winsBalance(value) {
        this.balance += value;
        this.balanceText.text = ("€ " + this.balance);
    };






}
