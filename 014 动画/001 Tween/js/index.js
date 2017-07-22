window.onload = function () {

    var stop = false;

    function animate(time) {
        if (!stop){
            requestAnimationFrame(animate);
        }
        TWEEN.update(time);
    }
    requestAnimationFrame(animate);

    var s = $('.s');
    var step1 = { left: 0 };

    var tween1 = new TWEEN.Tween({ left: 0 })
        .to({ left: 20 }, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
            /* s.style.transform = `translateX(${step1.left}px) translateZ(0px)`; */
            $(s).css('transform', `translateX(${step1.left}px) translateZ(0px)`);
        })
        .onComplete(function () {
            console.info('step1 is Complete');
        })

    var tween2 = new TWEEN.Tween(step1)
        .to({ left: 220 }, 10000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
            /* s.style.transform = `translateX(${step1.left}px) translateZ(0px)`; */
            $(s).css('transform', `translateX(${step1.left}px) translateZ(0px)`);
        })
        .onComplete(function () {
            console.info('step2 is Complete');
            stop = true;
        })

    tween1.chain(tween2);
    tween1.start();
}