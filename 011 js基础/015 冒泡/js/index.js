window.onload = function() {
    var root = document.getElementById('root');
    root.addEventListener('mousedown', function(e) {
        console.info('root md', e.target.href)
        e.target.href += '?44'
    }, false);

    var c = document.getElementById('c');
    c.addEventListener('mousedown', function(e) {
        console.info('c md')
    }, false)
}