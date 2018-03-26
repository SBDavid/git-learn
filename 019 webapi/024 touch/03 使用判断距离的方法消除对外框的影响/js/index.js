window.onload = function() {
    var target = document.getElementById('target');

    var startY = 0;

    var touchstartHandler = function(e) {
        startY = e.changedTouches[0].clientY;
        console.info('startY: ', startY);
    }

    var touchMoveHandler = function(e) {
        var changeY = startY - e.changedTouches[0].clientY;
        
        var scrollHeight = target.scrollHeight;

        // 下移动
        if (changeY > 0) {
            // 移动到底部
            if (scrollHeight === target.scrollTop + target.clientHeight) {
                e.preventDefault();
            }
        } else {
            if (scrollHeight === target.scrollTop + target.clientHeight) {
                target.removeEventListener('touchmove', touchMoveHandler);
                target.addEventListener('touchmove', touchMoveHandler);
            }
        }
    }

    target.addEventListener('touchstart', touchstartHandler);

    target.addEventListener('touchmove', touchMoveHandler);

}

// 如果内框滚动到最上或者最下，则外框会受到影响
// 内框上调用stopPropagation，并不能消除影响