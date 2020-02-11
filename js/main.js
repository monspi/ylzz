var screen_width = window.innerWidth/window.devicePixelRatio*1.5;
var height = window.innerHeight/window.devicePixelRatio*1.5;
var width = Math.min(screen_width, height*0.8);

Preload = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Preload ()
    {
        Phaser.Scene.call(this, { key: 'Preload' });
    },
    
    preload: function ()
    {
        this.load.image('logo','ylzz/monspi.png');
    },

    create: function ()
    {
        this.scene.start('load');
    }
});


Load = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Load ()
    {
        Phaser.Scene.call(this, { key: 'load' });
    },
    
    preload: function ()
    {
        var progress = this.add.graphics();
        progress.depth = 1;
        this.load.image('logo','ylzz/monspi.png');
        logo = this.add.image(0.5*width, 0.3*height, 'logo');
        logo.setOrigin(0.5,0);
        logo.setScale(0.8*width/logo.width);

        this.load.on('progress', function (value) {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0.1*width, 0.9*height, 0.8*width*value, 0.1*height);
        });

        loading = this.add.text(0.5*width,0.5*height, '加载中\n小水管敬请谅解',{ fontFamily: 'ui', fontSize: 36, color: '#ffffff', align: 'center'});
        loading.setOrigin(0.5, 0);
        loading = this.add.text(0.5*width,0.8*height, '© monspi.cn',{ fontFamily: 'ui', fontSize: 36, color: '#ffffff', align: 'center'});
        loading.setOrigin(0.5, 0);
        this.load.plugin('rexroundrectangleplugin', 'js/rexroundrectangleplugin.min.js', true);
        this.load.image('sky', 'ylzz/bg.png');
        this.load.image('ground', 'ylzz/ground.png');
        this.load.image('button','ylzz/button_large.png');
        this.load.image('star', 'ylzz/mask.png');
        this.load.image('bomb', 'ylzz/virus.png');
        this.load.spritesheet('dude', 'ylzz/ylzz.png', { frameWidth: 48, frameHeight: 96 });
        this.load.audio('AiHe', 'ylzz/AiHe.mp3');
    },

    create: function ()
    {
        // if (height>screen_width)
        // {
        //     alert('预览版, 触屏适配不完全');
        //     alert('触屏状态默认开启音乐且暂无法关闭,请手动调节设备音量或插好耳机');
        // }
        this.scene.start('menu');
    }
});

var config = {
    type: Phaser.CANVAS,
    width: width,
    height: height,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    //scene:['menu','help','game','result']
    scene:[Preload,Load,Menu,Game]
};

var ylzz = new Phaser.Game(config);