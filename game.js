/**
 * Created by Pablo on 09.12.2016.
 */
var game = new Phaser.Game(576,511, Phaser.AUTO, 'Flappy Bird',{preload: preload , create: create, update: update, render: render});
var tileSprite;
var bird;

var pipeMinY= 106;
var pipeMaxY = 350-pipeMinY;
var isAlive = true;
var spaceKey;
var cursors;
var pipeGroup;
var ground;
var holeSize = 100;
var jumpSize = -200;
var liveText;
var bottom;
var timer;
var score;
var deletedFirst = true;
var labelScore;

function preload(){
    game.load.spritesheet('bird', 'assets/bird.png',17,12);
    game.load.image('bg','assets/background.png');
    game.load.image('pipeUp','assets/kolumnaUp.png');
    game.load.image('pipeDown','assets/kolumnaDown.png');
    game.load.image('ground','assets/ground.png');
}

function create(){
    game.stage.scale.pageAlignHorizontally = true;
    game.stage.scale.pageAlignVeritcally = true;
    game.physics.setBoundsToWorld();
    game.physics.startSystem(Phaser.Physics.ARCADE);
    tileSprite = game.add.tileSprite(0,0,576,511,'bg');
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    pipeGroup = game.add.group();
    pipeGroup.enableBody = true;
    pipeGroup.physicsBodyType = Phaser.Physics.ARCADE;
    ground = game.add.tileSprite(0,game.world.height-50,game.world.width,110,'ground');
    game.physics.arcade.enable(ground);
    ground.body.immovable = true;
    liveText = game.add.text(238, 0, '', { font: "15px Arial", fill: "#ffffff", align: "left" });
    liveText.fixedToCamera = true;
    labelScore = game.add.text(20, 20, "0",
        { font: "30px Arial", fill: "#ffffff" });
    addBird();
    startGame();

}

function update(){
    game.physics.arcade.collide(bird, ground,hitSomething);
    bird.body.setSize(17,12+(Math.abs(bird.angle)*0.2));
    if(!isAlive){
        bird.animations.stop();
        if (bird.angle < 50) {
            bird.angle += 2;
        }
        return;
    }
    game.physics.arcade.overlap(bird, pipeGroup, hitSomething, null, this);
    ground.tilePosition.x -= 1.68;
    tileSprite.tilePosition.x -= 1.68;
    if(this.spaceKey.isDown){
        bird.body.velocity.y = jumpSize;
        bird.animations.play('fly');
        var animation = game.add.tween(bird).to({angle:-20},100);
        animation.start();
    }
    if(bird.body.velocity.y > 0 ){
        bird.animations.stop();
        if (bird.angle < 50) {
            bird.angle += 2;

        }
        bird.frame = 0;

    }
    if(pipeGroup.getAt(0).x < -52 ) {
        pipeOut();
        deletedFirst = true;
    }
    if(pipeGroup.getAt(0).x < 60 && deletedFirst) {
        ++score;
        labelScore.text = score;
        deletedFirst = false;
    }

    if(score>=2)
        bonus();

}


function addPipe(){
    var startHole = Math.floor(Math.random() * (pipeMaxY)) + pipeMinY;
    var pipeDown = pipeGroup.create(576,0,'pipeDown');
    pipeDown.scale.y = 1.5 ;
    pipeDown.y = -(pipeDown.height - startHole);
    bottom = pipeDown.bottom;
    var pipeUp = pipeGroup.create(576,startHole + holeSize, 'pipeUp');
    pipeUp.scale.y = 1.5 ;
    game.physics.arcade.enable(pipeDown);
    game.physics.arcade.enable(pipeUp);
    pipeDown.body.immovable = true;
    pipeDown.body.velocity.x = -100;
    pipeUp.body.velocity.x = -100;
    pipeUp.body.immovable = true;
    pipeDown.checkWorldBounds = true;
    pipeUp.checkWorldBounds = true;
/*    pipeUp.outOfBoundsKill = true;
    pipeDown.outOfBoundsKill = true;*/
   /* pipeUp.events.onOutOfBounds.add(pipeOut);*/
    /*pipeDown.events.onOutOfBounds.add(pipeOutDown);*/


}

function addBird(){
    bird = game.add.sprite(100, 100, 'bird');
    bird.scale.setTo(2,2);
    bird.anchor.setTo(-0.2, 0.5);
    bird.animations.add('fly',[0,1,2],10,true);
    game.physics.arcade.enable(bird);
    bird.body.gravity.y = 800;

}
function restartGame(){

    pipeGroup.removeAll();
    labelScore.text='';
    bird.body.velocity.x = 0 ;
}

function startGame() {
    timer = game.time.events.loop(2000, addPipe, this);
    score = 0;
    bird.x=100;
    bird.y = 100;
    isAlive = true;

}

function hitSomething(){
    if(isAlive == false)
        return
    isAlive = false;
    game.time.events.remove(timer);
    pipeGroup.forEach(function(pipe){
        pipe.body.velocity.x=0;
    })
}

function pipeOut(){
    pipeGroup.removeBetween(0,1,true);

}

function bonus(){
    var first = pipeGroup.getAt(4);
    var second = pipeGroup.getAt(5);
    var firstY = first.y;
    var secondY = second.y;
    game.add.tween(first.position).to( { y: (first.y - 40) }, 500, Phaser.Easing.Linear.None, true, 0, 1000, true);
    game.add.tween(second.position).to( { y: (second.y - 40)}, 500, Phaser.Easing.Linear.None, true, 0, 1000, true);
}

function render() {
  /*  game.debug.bodyInfo(bird, 32, 32);
    game.debug.body(bird);*/
}