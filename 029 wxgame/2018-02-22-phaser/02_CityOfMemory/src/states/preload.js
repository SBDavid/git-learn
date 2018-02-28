var game = require('../game');

let preload = function() {


}

preload.prototype.preload = function() {
    
    game.stage.backgroundColor = '#000000';

    var title = game.add.text(0, 0, 'loading', {
        fontSize: '40px',
        fontWeight: 'bold',
        fill: '#f2bb15'
    });
}

preload.prototype.create = function() {
    var self = this;
    setTimeout(function() {
        game.state.start('choseLevel');
    },1000);
}

module.exports = preload;