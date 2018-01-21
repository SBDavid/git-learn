module.exports = function(context, options) {
    var out = "<ul>";

    for(var i=0, l=context.length; i<l; i++) {
        out = out + "<li>" + options.fn(context[i]) + "</li>";
    }

    return out + "</ul>";
};