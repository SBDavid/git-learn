window.onload = function() {
    var test = document.getElementById('test');

    test.addEventListener('click', function() {
        console.info('click')
    })

    test.addEventListener('tap', function() {
        console.info('tap')
    })

    test.addEventListener('touchstart', function() {
        console.info('touchstart')
    })

    test.addEventListener('touchend', function() {
        console.info('touchend')
    })
}