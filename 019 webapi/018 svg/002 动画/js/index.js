window.onload = function() {
    var svg = document.getElementsByTagName('svg')[0];
    var target = document.getElementsByTagName('line')[0];

    function follow(e) {
        target.setAttribute('x2', e.offsetX);
        target.setAttribute('y2', e.offsetY);
    }

    target.addEventListener('mousedown', function(e){
        svg.addEventListener('mousemove', follow);
    });

    target.addEventListener('mouseup', function(e){
        svg.removeEventListener('mousemove', follow);
    });
}