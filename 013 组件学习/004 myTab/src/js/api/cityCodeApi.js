var $ = require('jquery');

module.exports = function () {
    var chain = $.Deferred();
    $.ppXHR.JSONP({
        url: '//iptable.pplive.com/api.php?type=json',
        type: 'GET',
        jsonp: 'cb',
    }).then(function (data) {
        chain.resolve(data);
    }, function (err) {
        chain.reject(err);
    });

    return chain;
}