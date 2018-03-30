window.onload = function () {
    // 自定义事件
    $.event.special.myEvent = {
        setup: function () {
            var elem = this;
            console.info('setup', elem);

        },
        teardown: function () {
            var elem = this;
            console.info('teardown', elem)
        }
    };

    $('.test').on('myEvent', function() {
        console.info('hit');
    });

    $('.test').trigger('myEvent');

    $('.test').off('myEvent');
}