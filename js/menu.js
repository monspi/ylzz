Menu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Menu ()
    {
        Phaser.Scene.call(this, { key: 'menu' });
    },

    create: function ()
    {
        this.input.addPointer(9);
        sky = this.add.image(0.5*width, 0.8*height, 'sky');
        sky.setOrigin(0.5, 1);
        platform = this.add.image(0.5*width, 0.7*height, 'ground');
        platform.setOrigin(0.5, 0);
        title = this.add.text(0.5*width,0.25*height, '影 流 之 主',{ fontFamily: 'ui', fontSize: 84, color: '#ffff40', align: 'center'});
        title.setOrigin(0.5, 1);
        warning = this.add.text(0.5*width,0.25*height+0.1*title.height, '战病毒',{ fontFamily: 'ui', fontSize: 48, color: '#ffff40', align: 'center'});
        warning.setOrigin(0.5, 0);
        version = this.add.text(0.5*width,0.9*height, 'v0.9\n© monspi.cn',{ fontFamily: 'ui', fontSize: 20, color: '#ffffff', align: 'center'});
        version.setOrigin(0.5, 0.5);

        btnStart = this.add.sprite(0.5*width, 0.7*height-48, 'button').setScale(1.5);
        txtStart = this.add.text(btnStart.x,btnStart.y, '开始游戏',{ fontFamily: 'ui', fontSize: 48, color: '#00aa41', align: 'center'});
        txtStart.setOrigin(0.5, 0.5);

        btnHelp = this.add.sprite(0.5*width, 0.7*height+48, 'button').setScale(1.5);
        txtHelp = this.add.text(btnHelp.x, btnHelp.y, '帮助',{ fontFamily: 'ui', fontSize: 48, color: '#00aa41', align: 'center'});
        txtHelp.setOrigin(0.5, 0.5);

        helpContainer = help(this);
        helpContainer.alpha =0;

        btnStart.setInteractive().on('pointerdown', function(){
            this.scene.start('game');
        },this);

        btnHelp.setInteractive().on('pointerover', function(){
            helpContainer.alpha =1;         
        },this);

        btnHelp.setInteractive().on('pointerout', function(){
            helpContainer.alpha =0;         
        },this);
    }
});
function help(scene)
{
    var largeRoundRect=scene.add.rexRoundRectangle(0,0,0.72*width,0.6*height+0.02*width,0.01*width,0x000000);
    var smallRoundRect=scene.add.rexRoundRectangle(0,0,0.7*width,0.6*height,0.01*width,0xffff40);
    var helptext = scene.add.text(0,0,
        '游戏目标:\n操控本体与分身, 拾取口罩, 躲避病毒\n\n'+
        '注意: 分身触碰病毒也会游戏结束\n\n'+
        '操控方式: \n'+
        '← →移动, ↑展开分身, ↓加速收回分身\n'+
        '分身会缓慢自动收回\n\n'+
        '触屏可以使用虚拟按键操作\n\n'+
        '提醒: BGM默认开启!!!',
        { fontFamily: 'ui', fontSize: 24 , color: '#000000', align: 'left', lineSpacing: 5,wordWrap: {width: 0.65*width}});
        helptext.setOrigin(0.5, 0.5);
    return container = scene.add.container(0.5*width,0.4*height,[largeRoundRect,smallRoundRect,helptext]);
}