function(obj) {
    var __t, __p = '', __j = Array.prototype.join, print = function () { __p += __j.call(arguments, ''); };
    with (obj || {}) {
        __p += '<ul>         ';
        _.each(data, function (item) {
            __p += '             <li name=' +
                ((__t = (item.name)) == null ? '' : __t) +
                '>' +
                ((__t = (item.name)) == null ? '' : __t) +
                '</li>         ';
        });
        __p += '         <li class=\'test\'>end</li>     </ul>';
    }
    return __p;
}