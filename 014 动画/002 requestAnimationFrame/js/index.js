window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

window.onload = function () {
    var start = null;
    var d = document.getElementById('SomeElementYouWantToAnimate');
    function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = timestamp - start;
        d.style.left = Math.min(progress / 10, 20000) + "px";
        if (progress < 200000) {
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
}