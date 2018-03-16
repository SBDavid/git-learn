window.onload = function() {

    var startX = null;

    var swiper = document.getElementById('swiper');

    var moveCallback = function(event) {
        var changeX = event.changedTouches[0].clientX - startX;
        console.info(changeX);
    }

    swiper.addEventListener('touchstart', function(event) {
        var startTouch = event.changedTouches[0];
        
        startX = startTouch.clientX;

        window.addEventListener('touchmove', moveCallback);


    })
}