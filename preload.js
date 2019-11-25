/**
 * Created by Pablo on 12.01.2017.
 */

var preload = function(){}

preload.prototype = {
    init: function(params) {
    },
    preload: function(){

        this.game.load.spritesheet('bird', 'assets/bird.png',17,12);
        this.game.load.image('bg','assets/background.png');
        this.game.load.image('pipeUp','assets/kolumnaUp.png');
        this.game.load.image('pipeDown','assets/kolumnaDown.png');
        this.game.load.image('ground','assets/ground.png');
        this.game.load.image("gametitle", "assets/menu/flappyBirdTitle.png");
        this.game.load.image("playbutton", "assets/menu/start.png");
        this.game.load.image("menubutton", "assets/menu/menubutton.png");
        this.game.load.image("menuBackground", "assets/menu/bigBackground.png");
        this.game.load.image("scoreboard", "assets/menu/scoreBoard.png");
        this.game.load.image("goldmedal", "assets/menu/goldMedal.png");
        this.game.load.image("silvermedal", "assets/menu/silverMedal.png");
        this.game.load.image("gameover", "assets/menu/gameOver.png");
        this.game.load.image("pressspace", "assets/menu/pressSpace.png");
        this.game.load.image("getready", "assets/menu/getReady.png");
        this.game.load.bitmapFont('flappyfont', 'assets/flappyfont/flappyfont.png', 'assets/flappyfont/flappyfont.fnt');
    },

    create: function(){
        this.game.state.start("Menu");
    }
}