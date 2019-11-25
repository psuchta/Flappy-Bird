var menu = function(){
    menuGroup = null;
    birdMenu = null;
    backGround = null;
}
menu.prototype = {
    init: function(parms) {   },
    create: function(){
        backGround = this.game.add.tileSprite(0,0,576,511,'bg');
        var title = this.game.add.sprite(this.game.width / 2, 60, "gametitle");
        title.anchor.set(0.5);
        var playButton = this.game.add.button(this.game.width / 2, this.game.height / 2 + 100, "playbutton", this.playTheGame);
        playButton.anchor.set(0.5);
        playButton.scale.setTo(2,2);
        menuGroup = this.game.add.group();
        var menuButton = this.game.add.button(this.game.width / 2, this.game.height - 30, "menubutton", toggleMenu);
        menuButton.anchor.set(0.5);
        menuGroup.add(menuButton);
        var style = { font: "20px Impact", fill: "#0099cc", align: "center" };
        var text = this.game.add.text(this.game.width / 2 - 80, this.game.height + 130, "Autor: Paweł Suchta", style, menuGroup);
        birdMenu = this.game.add.sprite(this.game.width / 2-25, this.game.height / 2 +20, 'bird');
        birdMenu.scale.setTo(2,2);
        birdMenu.anchor.setTo(-0.2, 0.5);
        birdMenu.animations.add('fly',[0,1,2],10,true);
        this.game.add.tween(birdMenu).to({
            y: this.game.height / 2 - 100
        }, 1500, Phaser.Easing.Linear.NONE, true,0,1000,true);

    },
    update: function(){
        birdMenu.animations.play('fly');
        backGround.tilePosition.x -= 1.68;
    },
    playTheGame: function(){
        this.game.state.start("TheGame");
    }
}

function toggleMenu(){
    if(menuGroup.y == 0){
        var menuTween = this.game.add.tween(menuGroup).to({
            y: -180
        }, 500, Phaser.Easing.Bounce.Out, true);
    }
    if(menuGroup.y == -180){
        var menuTween = this.game.add.tween(menuGroup).to({
            y: 0
        }, 500, Phaser.Easing.Bounce.Out, true);
    }
}