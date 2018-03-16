window.onload = function() {

    var startX = null;
    var startLeft = null;

    var swiper = document.getElementById('swiper');

    swiper.getElementsByTagName('ul')[0].style.transform  = 'translateX(0px)';

    var moveCallback = function(event) {
        event.preventDefault();
        // event.stopPropagation();
        
        
        var changeX = event.changedTouches[0].clientX - startX;
        //console.info(changeX);
        swiper.getElementsByTagName('ul')[0].style.transform  = `translateX(${startLeft + changeX}px)`;
    }

    swiper.addEventListener('touchstart', function(event) {
        var startTouch = event.changedTouches[0];
        
        startX = startTouch.clientX;
        startLeft = parseInt(swiper.getElementsByTagName('ul')[0].style.transform.slice(11, -3));

        swiper.addEventListener('touchmove', moveCallback, {
            passive: false
        });
    });

    swiper.addEventListener('touchend', function(event) {
        swiper.removeEventListener('touchmove', moveCallback);
    });
}