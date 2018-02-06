window.onload = function() {
    // jquery 动画学习
    $('div')
        .animate({
            top: "100px",
            left: "100px"
        }, {
            queue: 'position',
            duration: 500,
            /* complete: function() {
                $('div').stop('position', false, false)
            } */
            /* step: function(now, tween) {
                console.info(now, tween.now);
            }, */
            progress: function( animation, progress, remainingMs) {
                animation.then(function(res) {
                    console.info(res, progress, remainingMs)
                })
                
            }
        })
        .animate({
            top: "200px",
            left: "200px"
        }, {
            queue: 'position',
            duration: 500
        })
        .animate({
            height: "200px",
            width: "200px"
        }, {
            queue: 'size',
            duration: 1000
        })
        .dequeue("position")
        .dequeue("size")
}