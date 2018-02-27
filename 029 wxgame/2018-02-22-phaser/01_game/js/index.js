window.onload = function() {

    var width = window.innerWidth;
    var height = window.innerHeight;

    var game = new Phaser.Game(width, height, Phaser.CANVAS, 'root');

    var states = {
        // 加载场景
        preload: function() {
            this.create = function() {
                game.stage.backgroundColor = '#aaa';
                setTimeout(function() {
                    game.state.start('created');
                }, 3000)
            }
        },
        // 开始场景
        created: function() {
            this.create = function() {
                game.stage.backgroundColor = '#777';
                setTimeout(function() {
                    game.state.start('play');
                }, 3000)
            }
        },
        // 游戏场景
        play: function() {
            this.create = function() {
                alert('play')
            }
        },
        // 结束场景
        over: function() {}
    };

    // 添加场景到游戏示例中
    Object.keys(states).map(function(key) {
        game.state.add(key, states[key]);
    });

    game.state.start('preload');
}