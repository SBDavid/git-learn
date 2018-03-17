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

// touch 事件会正常冒泡，也可以停止冒泡
// 对于touchmove事件，即使鼠标离开了target，事件仍然在target上触发。并不会转移到手指当前坐在的Dom