class ButtonBar {

    constructor(app) {

        this.game = app;

    }

    setup() {
        this.buttonPlay = PIXI.Sprite.fromImage('assets/buttonPlay.png');
        this.buttonPlay.height = 100;
        this.buttonPlay.width = 100;
        this.buttonPlay.anchor.set(0.5);
        this.buttonPlay.position.x = app.screen.width / 2;
        this.buttonPlay.position.y = (window.innerHeight / 2 + this.buttonPlay.height / 2);
        this.buttonPlay.interactive = true;
        this.buttonPlay.buttonMode = true;

        this.style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 25,
            fontWeight: 'bold',
            dropShadowAngle: Math.PI / 6,
            wordWrap: true,
            wordWrapWidth: 440
        });

        this.totalWin = 0;
        this.balance = 50000;

        this.totalWinText = new PIXI.Text('TOTAL WIN: ' + this.totalWin, this.style);
        this.balanceText = new PIXI.Text('BALANCE: ' + this.balance, this.style);

        this.totalWinText.x = 30;
        this.totalWinText.y = this.buttonPlay.y;

        this.balanceText.x = 30;
        this.balanceText.y = this.buttonPlay.y - 30;



        this.game.stage.addChild(this.buttonPlay);
        this.game.stage.addChild(this.totalWinText);
        this.game.stage.addChild(this.balanceText);

    }

    setTotalWin(value) {
        this.totalWin += value;
        this.totalWinText = new PIXI.Text('TOTAL WIN: ' + this.totalWin, this.style);
        this.totalWinText.x = 30;
        this.totalWinText.y = this.buttonPlay.y;
        this.game.stage.addChild(this.totalWinText);
    };

    setBalance(value) {
        this.balance += value;
        this.balanceText = new PIXI.Text('BALANCE: ' + this.balance, this.style);
        this.balanceText.x = 30;
        this.balanceText.y = this.buttonPlay.y - 30;
        this.game.stage.addChild(this.balanceText);
    };




}
