
var boot = function(game,bestScore){
};

boot.prototype = {
    preload: function(){
        this.game.load.image("loading","assets/loading.png");
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.setScreenSize = true;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.stage.backgroundColor = "#aae916";
    },
    create: function(){
        this.game.state.start("Preload");
    }
}