

var theGame = function() {
    tileSprite = null;
    bird = null;
    pipeMinY = 106;
    pipeMaxY = 350 - pipeMinY;
    isAlive = false;
    spaceKey = null;
    cursors = null;
    pipeGroup = null;
    overGroup = null;
    ground = null;
    holeSize = null;
    jumpSize = null;
    birdGravity = null;
    bottom = null;
    timer = null;
    score=0;
    deletedFirst = true;
    labelScore = null;
    medal= null ;
    scoreBoard = null;
    goldMedal = null;
    instructionGroup = null;
    gameOver = null;
    firstScored = false;
    difficultChange = false;

}

theGame.prototype = {
    init: function(parms) {   },
    create: function () {
        this.addMap();
        overGroup = this.game.add.group();
        instructionGroup = this.game.add.group();
        this.game.physics.setBoundsToWorld();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        this.spaceKey.onDown.addOnce(this.startGame, this);
        this.spaceKey.onDown.add(this.flap, this);
        pipeGroup.enableBody = true;
        pipeGroup.physicsBodyType = Phaser.Physics.ARCADE;
        labelScore = this.game.add.bitmapText(this.game.width / 2, 30, 'flappyfont','0',40);
        labelScore.anchor.setTo(0.5);
        var getReady = this.game.add.sprite(this.game.width / 2, 100, 'getready');
        var pressSpace = this.game.add.sprite(this.game.width / 2, this.game.world.height/2+100, 'pressspace');
        getReady.anchor.setTo(0.5,0.5);
        pressSpace.anchor.setTo(0.5);
        instructionGroup.add(getReady);
        instructionGroup.add(pressSpace);
        holeSize = 100;
        jumpSize = -300;
        birdGravity = 1100;
        this.addBird();

    },
    update: function () {

        var collideGround = this.game.physics.arcade.collide(bird, ground, this.hitSomething,null,this);
        this.game.physics.arcade.overlap(bird, pipeGroup, this.hitSomething, null, this);
        if (!isAlive) {
            if (bird.angle < 50 && bird.body != null && !(collideGround )) {
                bird.angle += 2;
                bird.body.setSize(17, 12 + (Math.abs(bird.angle) * 0.2));

            }

            return;
        }
        bird.body.setSize(17, 12 + (Math.abs(bird.angle) * 0.2));
        if(score ==  3 && !difficultChange){
            holeSize = 80;
            jumpSize = -300;
            birdGravity = 1300;
        }
        if (bird.body.velocity.y > 0) {
            if (bird.angle < 50 ) {
                bird.angle += 2;

            }
            if(bird.body.velocity.y>200) {
                bird.animations.stop();
                bird.frame = 0;
            }

        }
        if (pipeGroup.getAt(0).x < -52) {
            this.pipeOut();
           firstScored = false;
        }


        if ((bird.x >= pipeGroup.getAt(0).x) && !firstScored) {
            ++score;
            labelScore.text = score;
            firstScored= true;
        }

        if (score >= 5)
            this.bonus();

    },

    addScoreBorad: function(){
        scoreBoard  = this.game.add.sprite(this.game.width / 2, this.game.height +100, 'scoreboard');
        gameOver  = this.game.add.sprite(this.game.width / 2, -50, 'gameover');
        var playButton = this.game.add.button(this.game.width / 2, this.game.height +250, 'playbutton',this.playTheGame);
        var retryText = this.game.add.bitmapText(this.game.width / 2, this.game.height +200, 'flappyfont','Play Again ',30);
        retryText.anchor.setTo(0.5);
        playButton.anchor.setTo(0.5);
        playButton.scale.setTo(1.5);
        gameOver.anchor.setTo(0.5);
        scoreBoard.anchor.set(0.5);
        overGroup.add(scoreBoard);
        overGroup.add(retryText);
        overGroup.add(playButton);


        if(score>=7 && score <=10) {
            var silverMedal = this.game.add.sprite(46 - scoreBoard.offsetX, 63 - scoreBoard.offsetY, 'silvermedal');
            silverMedal.anchor.set(0.5);
            scoreBoard.addChild(silverMedal);
        }
        else if(score>=11) {
            var goldMedal = this.game.add.sprite(46 - scoreBoard.offsetX, 63 - scoreBoard.offsetY, 'goldmedal');
            goldMedal.anchor.set(0.5);
            scoreBoard.addChild(goldMedal);
        }
        var lastScore = this.game.add.bitmapText(185-scoreBoard.offsetX,45-scoreBoard.offsetY, 'flappyfont','0',20);
        lastScore.anchor.setTo(0.5);
        lastScore.text = score;
        var highScore = this.game.add.bitmapText(185-scoreBoard.offsetX,85-scoreBoard.offsetY, 'flappyfont','0',20);
        highScore.anchor.setTo(0.5);
        highScore.text = localStorage.getItem('highScore');
        scoreBoard.addChild(lastScore);
        scoreBoard.addChild(highScore);


    },

    addPipe: function () {
        var startHole = Math.floor(Math.random() * (pipeMaxY)) + pipeMinY;
        var pipeDown = pipeGroup.create(576, 0, 'pipeDown');
        pipeDown.scale.y = 1.5;
        pipeDown.y = -(pipeDown.height - startHole);
        bottom = pipeDown.bottom;
        var pipeUp = pipeGroup.create(576, startHole + holeSize, 'pipeUp');
        pipeUp.scale.y = 1.5;
        this.game.physics.arcade.enable(pipeDown);
        this.game.physics.arcade.enable(pipeUp);
        pipeDown.body.immovable = true;
        pipeDown.body.velocity.x = -100;
        pipeUp.body.velocity.x = -100;
        pipeUp.body.immovable = true;
        pipeDown.checkWorldBounds = true;
        pipeUp.checkWorldBounds = true;

    },
    flap: function(){
        if(!isAlive)
            return;
        bird.body.velocity.y = jumpSize;
        bird.animations.play('fly');
        var animation = this.game.add.tween(bird).to({angle: -20}, 100);
        animation.start();
    },
    addMap: function() {
        var scrollSpeed = -100;
        tileSprite = this.game.add.tileSprite(0, 0, 576, 511, 'bg');
        tileSprite.autoScroll(scrollSpeed,0);
        pipeGroup = this.game.add.group();
        ground = this.game.add.tileSprite(0, this.game.world.height - 50, this.game.world.width, 110, 'ground');
        this.game.physics.arcade.enable(ground);
        ground.body.immovable = true;
        ground.autoScroll(scrollSpeed, 0);
    },
    addBird: function () {
        bird = this.game.add.sprite(100, this.game.world.height /2-50, 'bird');
        bird.scale.setTo(2, 2);
        bird.anchor.setTo(-0.1, 0.5);
        bird.animations.add('fly', [0, 1, 2], 10, true)
        bird.animations.play('fly');


    },
    restartGame: function () {

        pipeGroup.removeAll();
        labelScore.text = '';
        bird.body.velocity.x = 0;
    },

    startGame: function () {
        timer = this.game.time.events.loop(2000, this.addPipe, this);
        instructionGroup.destroy();
        score = 0;
        isAlive = true;
        this.game.physics.arcade.enable(bird);
         bird.body.gravity.y = birdGravity;

    },

    hitSomething: function () {
        tileSprite.autoScroll(0,0);
        ground.autoScroll(-0,0);
        if (isAlive == false)
            return
        isAlive = false;
        bird.animations.stop();
        this.game.time.events.remove(timer);
        pipeGroup.forEach(function (pipe) {
            pipe.body.velocity.x = 0;
        })
        this.saveScore();
        this.addScoreBorad();
        this.game.add.tween(overGroup).to({y: (-this.game.height/2)-100}, 500, Phaser.Easing.Bounce.Out, true);
        this.game.add.tween(gameOver).to({y: 150}, 500, Phaser.Easing.Bounce.Out, true);
    },

    pipeOut: function () {
        pipeGroup.removeBetween(0, 1, true);

    },

    bonus: function () {
        var first = pipeGroup.getAt(4);
        var second = pipeGroup.getAt(5);
        var firstY = first.y;
        var secondY = second.y;
        this.game.add.tween(first.position).to({y: (first.y - 40)}, 500, Phaser.Easing.Linear.None, true, 0, 1000, true);
        this.game.add.tween(second.position).to({y: (second.y - 40)}, 500, Phaser.Easing.Linear.None, true, 0, 1000, true);
    },

    saveScore: function(){
        if(score > localStorage.getItem('highScore') || localStorage.getItem('highScore') == null){
            localStorage.setItem('highScore',score);
        }
    },
    playTheGame: function(){
        this.game.state.start("TheGame");
    }

}

