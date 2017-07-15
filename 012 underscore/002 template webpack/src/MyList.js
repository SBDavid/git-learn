var _ = require('underscore');
var listen = require('eventlistener');

var tmpl = 
    "<ul> \
        <% _.each(data, function(item){ %> \
            <li name=<%= item.name %>><%= item.name %></li> \
        <% }); %> \
        <li class='test'>end</li> \
    </ul>";

var mylist = function() {
    this.compiled = _.template(tmpl);
}

mylist.prototype.mount = function(ele, data) {
    var elem = document.createElement("div");
    elem.innerHTML = this.compiled(data);
    
    var test = elem.getElementsByClassName('test');
    listen.add(test[0], 'click', function(e) {
        console.log('test');
    })


    ele.appendChild(elem.firstChild);
}

module.exports.mylist = mylist;