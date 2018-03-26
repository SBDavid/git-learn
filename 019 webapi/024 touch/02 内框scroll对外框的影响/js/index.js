window.onload = function() {
    var target = document.getElementById('target');

    target.addEventListener('touchstart', function() {
        console.info('target touchstart');
    });

    target.addEventListener('touchmove', function(e) {
        e.stopPropagation();
        console.info('target touchmove');
    });

    document.addEventListener('touchstart', function() {
        console.info('document touchstart');
    });

    document.addEventListener('touchmove', function() {
        console.info('document touchmove');
    })
}

// 如果内框滚动到最上或者最下，则外框会受到影响
// 内框上调用stopPropagation，并不能消除影响