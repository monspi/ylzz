var player;
var button;
var stars;
var bombs;
var platforms;
var button;

var score = 0;
var combo = 0;
var maxcombo = 0;
var final = 0;

var star_grn =0;
var gameOver = false;
var scoreText;

var v_player = 0;
var v_shadowL = 0;
var v_shadowR = 0;

var flags = [false,false,false,false];

Game = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Game ()
    {
        Phaser.Scene.call(this, { key: 'game' });
    },

    preload: function()
    {
        if (height > screen_width)
        {
            alert('再次提醒:\n触屏默认开启音乐且暂无法关闭,请手动调节设备音量或插好耳机');
        }
    },
    create: function()
    {
        music = this.sound.add('AiHe',{mute:false});
        music.play();

        pointer = this.input.activePointer;
        sky = this.add.image(0.5*width, 0.8*height, 'sky');
        sky.setOrigin(0.5, 1);
        platforms = this.physics.add.staticGroup();
        platform = platforms.create(0.5*width, 0.7*height, 'ground');
        platform.setOrigin(0.5, 0);
        platform.body.setOffset(0,0.5*platform.height+10);

        version = this.add.text(0.5*width,height-18, 'v0.9\n© monspi.cn',{ fontFamily: 'ui', fontSize: 18, color: '#ffffff', align: 'center'});
        version.setOrigin(0.5, 1);

        player = playerInit(this,0.5*width, platform.y,'dude');
        shadowL = generateShadow(this,player,'dude');
        shadowR = generateShadow(this,player,'dude');
        stars = this.physics.add.group();
        stars.depth = 1 ;
        bombs = this.physics.add.group();
        bombs.depth = 5 ;

        //Gamestart(this,stars,bombs,bpm,offset,map);
        //musicplay(this,'AiHe');

        this.input.addPointer(4);

        buttonsize=Math.min(0.4*width,0.9*(height-player.y-0.5*player.height));

        buttonR = buttonGenerate(this,buttonsize,0.95*width,0.95*height,-1);
        input(this,buttonR);

        buttonL = buttonGenerate(this,buttonsize,0.05*width,0.95*height,1);
        input(this,buttonL);

        stars = this.physics.add.group();
        for (i = 0; i < 5; i++)
        {
            star = stars.create(Phaser.Math.Between(32, width-32), 0, 'star');
            star.setVelocityY((1+score*0.05)*Phaser.Math.Between(120, 240));
        }

        scoreText = this.add.text(16, 16, '', {fontFamily: 'ui',fontSize: '32px', fill: '#000' });
        scoreText.depth = 9 ;

        gameOverScr = gameOverScreen(this);
        gameOverScr.alpha = 0 ;
        gameOverScr.depth = 10 ;
        this.physics.add.collider(player, platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(player, stars, collectStar, null, this);
        this.physics.add.overlap(shadowL, stars, collectStar, null, this);
        this.physics.add.overlap(shadowR, stars, collectStar, null, this);
        this.physics.add.overlap(player, bombs, collectBomb, null, this);
        this.physics.add.overlap(shadowL, bombs, collectBomb, null, this);
        this.physics.add.overlap(shadowR, bombs, collectBomb, null, this);
        this.physics.add.collider(stars, platforms, disappearStar, null, this);
        this.physics.add.collider(bombs, platforms, disappearStar, null, this);

    },

    update: function()
    {
        music.once('complete', function(){
            gameOver = True;
        });

        if (gameOver)
        {
            player.anims.play('turn', true);
            this.physics.pause();
            music.stop();
            final = score;
            score = 0;
            combo = 0;
            maxcombo = 0;
            star_grn = 0;
            gameOver = false;
            gameOverScr.alpha = 1;
            finaltext = this.add.text(gameOverScr.x,gameOverScr.y,final.toString(),
            { fontFamily: 'ui', fontSize: 0.2*width , color: '#000000', align: 'center'});
            finaltext.setOrigin(0.5, 0.5);
            finaltext.depth = 11;
            gameOverScr.first.setInteractive().on('pointerdown', function (pointer) {
                this.scene.start('game');
            },this);
        }
        move(this,pointer,flags);
    }
});

function gameOverScreen(scene)
{
    var largeRoundRect=scene.add.rexRoundRectangle(0,0,0.72*width,0.3*height+0.02*width,0.01*width,0x21572f);
    var smallRoundRect=scene.add.rexRoundRectangle(0,0,0.7*width,0.3*height,0.01*width,0xffff40);
    var hinttext1 = scene.add.text(0,-0.13*height,
        '您的得分:',
        { fontFamily: 'ui', fontSize: 36 , color: '#000000', align: 'center'});
        hinttext1.setOrigin(0.5, 0);
    var hinttext2 = scene.add.text(0,0.13*height,
        '点击重新开始',
        { fontFamily: 'ui', fontSize: 36 , color: '#000000', align: 'center'});
        hinttext2.setOrigin(0.5, 1);
    return container = scene.add.container(0.5*width,0.4*height,[largeRoundRect,smallRoundRect,hinttext1,hinttext2]);
}

function collectStar (player, star)
{
    star.disableBody(true, true);
    score += 10+combo;
    combo +=1
    if (combo > maxcombo)
    {
        maxcombo = combo;
    }
    scoreText.setText('Score: ' + score +'\nCombo: '+ combo+'\nMax Combo: '+ maxcombo);
    flag = Math.random();
    if (flag > 0.5*star_grn/(star_grn+75))
    {
        starN = stars.create(Phaser.Math.Between(32, width-32), 0, 'star');
        starN.setVelocityY((1+star_grn*0.01)*Phaser.Math.Between(120, 240));
    }
    
    else
    {
        BombN = bombs.create(Phaser.Math.Between(32, width-32), 0, 'bomb');
        BombN.setVelocityY((1+star_grn*0.01)*Phaser.Math.Between(120, 240))
    }
    star_grn += 1;
}

function collectBomb (player, star)
{
    gameOver = true;
    shadowL.alpha = 0;
    shadowR.alpha = 0;
}

function disappearStar (star)
{
    star.disableBody(true, true);
    combo = 0;
    scoreText.setText('Score: ' + score +'\nCombo: '+ combo+'\nMax Combo: '+ maxcombo);
    flag = Math.random();
    if (flag > 0.5*star_grn/(star_grn+75))
    {
        starN = stars.create(Phaser.Math.Between(32, width-32), 0, 'star');
        starN.setVelocityY((1+star_grn*0.01)*Phaser.Math.Between(120, 240));
    }
    else
    {
        BombN = bombs.create(Phaser.Math.Between(32, width-32), 0, 'bomb');
        BombN.setVelocityY((1+star_grn*0.01)*Phaser.Math.Between(120, 240));
    }
    star_grn += 1;
}

function playerInit(game,locX,locY,spriteName)
{
	// The player and its settings
    var player = game.physics.add.sprite(locX, locY, spriteName);
    player.body.setOffset(0,6);

    //  Player physics properties. Give the little guy a slight bounce.
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    game.anims.create({
        key: 'left',
        frames: game.anims.generateFrameNumbers(spriteName, { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1
    });

    game.anims.create({
        key: 'turn',
        frames: [ { key: spriteName, frame: 3 } ],
        frameRate: 20
    });

    game.anims.create({
        key: 'right',
        frames: game.anims.generateFrameNumbers(spriteName, { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1
    });

	return player
}
function generateShadow(game,player,spriteName)
{
    var shadow = game.physics.add.sprite(player.x, player.y, spriteName);
    shadow.body.setOffset(0,6);
    shadow.setCollideWorldBounds(false);
	return shadow;
}

function Gamestart(game,bpm,offset,map,speed)
{
    var DELAY =2000;
    game.time.delayedCall(DELAY, musicplay, [], this);
    delay_16th = 240000/(16*bpm);
    delay_falldown = 520/speed*1000

    for(line in map)
    {
        if (line == 0) 
        {
            game.time.delayedCall(map[line][0]*delay_16th-delay_falldown,star_generate(line.slice(1),'star','bomb',speed),[],this);
        }
        else 
        {
            game.time.delayedCall(map[line][0]*delay_16th,star_generate(line.slice(1),'star','bomb',speed),[],this);
        }
    }
}

function star_generate(arr,starName,bombName,speed)
{
    for (loc in arr)
    {
        if (arr[loc] > 0)  //half_width of sprite
        {
            star = stars.create(arr[loc], 0, 'star');
            star.setVelocityY(speed);
        }
        else
        {
            bomb = bombs.create(arr[loc], 0, 'star');
            bomb.body.setCircle(8,0,0);
            bomb.setVelocityY(speed);
        }
    }
}

function musicplay(scene,musicName)
{
    music = scene.sound.add(musicName);
    music.play();
    return music;
}

function input(scene,buttons)
{
    var C=buttons.first;
    var U=buttons.next;
    var R=buttons.next;
    var B=buttons.next;
    var L=buttons.next;
    U.setInteractive().on('pointerdown', function (pointer) {flags[0]=true ;U.alpha=  1;});
    U.setInteractive().on('pointerover', function (pointer) {flags[0]=true ;U.alpha=  1;});
    U.setInteractive().on('pointerout' , function (pointer) {flags[0]=false;U.alpha=0.3;});
    U.setInteractive().on('pointerup'  , function (pointer) {flags[0]=false;U.alpha=0.3;});
    B.setInteractive().on('pointerdown', function (pointer) {flags[1]=true ;B.alpha=  1;});
    B.setInteractive().on('pointerover', function (pointer) {flags[1]=true;B.alpha=  1;});
    B.setInteractive().on('pointerout' , function (pointer) {flags[1]=false;B.alpha=0.3;});
    B.setInteractive().on('pointerup'  , function (pointer) {flags[1]=false;B.alpha=0.3;});
    L.setInteractive().on('pointerdown', function (pointer) {flags[2]=true ;L.alpha=  1;});
    L.setInteractive().on('pointerover', function (pointer) {flags[2]=true ;L.alpha=  1;});
    L.setInteractive().on('pointerout' , function (pointer) {flags[2]=false;L.alpha=0.3;});
    L.setInteractive().on('pointerup'  , function (pointer) {flags[2]=false;L.alpha=0.3;});
    R.setInteractive().on('pointerdown', function (pointer) {flags[3]=true ;R.alpha=  1;});
    R.setInteractive().on('pointerover', function (pointer) {flags[3]=true ;R.alpha=  1;});
    R.setInteractive().on('pointerout' , function (pointer) {flags[3]=false;R.alpha=0.3;});
    R.setInteractive().on('pointerup'  , function (pointer) {flags[3]=false;R.alpha=0.3;});
}

function move(scene,point,flag)
{
    if(shadowL.x > player.x) 
    {
        shadowL.x=player.x;
        shadowL.alpha = 0;
        player.anims.play('left', true);
        shadowL.anims.play('left', true);
    }
    else
    {
        shadowL.alpha = 0.8;
        player.anims.play('right', true);
        shadowL.anims.play('right', true);
    }

    if(shadowR.x < player.x) 
    {
        shadowR.x=player.x;
        shadowR.alpha = 0;
        player.anims.play('left', true);
        shadowR.anims.play('left', true);
    }
    else
    {
        shadowR.alpha = 0.8;
        player.anims.play('right', true);
        shadowR.anims.play('right', true);
    }

    if (scene.input.keyboard.addKey('UP').isDown ||flag[0])
    {
        v_shadowL = -320;
        v_shadowR = 320;
    }
    else if (scene.input.keyboard.addKey('DOWN').isDown || flag[1])
    {
        v_shadowL = 320;
        v_shadowR = -320;
    }
    else
    {
        v_shadowL = 80;
        v_shadowR = -80;
    }

    if (scene.input.keyboard.addKey('RIGHT').isDown || flag[3])
    {
        v_player = 240;
    }
    else if (scene.input.keyboard.addKey('LEFT').isDown || flag[2])
    {
        v_player = -240;
    }
    else
    {
        v_player = 0;
    };

    scene.input.keyboard.on('keydown-C', function ()
    {
        music.setMute(!(music.mute));
    });

    scene.input.keyboard.on('keydown-ESC', function ()
    {
        gameOver = true;
    });

    player.setVelocityX(v_player);
    shadowL.setVelocityX(player.body.velocity.x+v_shadowL);
    shadowR.setVelocityX(player.body.velocity.x+v_shadowR);
}


function buttonGenerate(scene,size,locX,locY,f)
{
    var r = size/3.6;
    var buttonR = scene.add.circle(r,0,0.6*r,0x000000,0.5);
    var triangleR = scene.add.triangle(r,0,0,0,12,8,0,16,0xffffff);
    var buttonB = scene.add.circle(0,r,0.6*r,0x000000,0.5);
    var triangleB = scene.add.triangle(0,r,0,0,8,12,16,0,0xffffff);
    var buttonL = scene.add.circle(-r,0,0.6*r,0x000000,0.5);
    var triangleL = scene.add.triangle(-r,0,12,0,0,8,12,16,0xffffff);
    var buttonU = scene.add.circle(0,-r,0.6*r,0x000000,0.5);
    var triangleU = scene.add.triangle(0,-r,0,12,8,0,16,12,0xffffff);
    var buttonC = scene.add.circle(0, 0, 0.3*r, 0x000000,0.5);
    var polygon = scene.add.polygon(0, 0, [0,4,4,8,8,4,4,0],0xffffff);
    return container = scene.add.container(locX+f*0.5*size,locY-0.5*size,[buttonC,buttonU,buttonR,buttonB,buttonL,polygon,triangleU,triangleR,triangleB,triangleL]);
}