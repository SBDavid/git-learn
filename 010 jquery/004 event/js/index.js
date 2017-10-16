window.onload = function() {
    let root = $('#root');
    document.getElementById('on').addEventListener('click', function() {
        $(root).on('click', 'a', function(e) {
            console.info('click', e)
        });
    });

    document.getElementById('off').addEventListener('click', function() {
        $(root).off('click', 'a');
    });

    document.getElementById('trigger').addEventListener('click', function() {
        $(root).find('a').trigger('click');
    });
}