var _ = require('./underscore');
var $ = require('jquery');
var listen = require('eventlistener');

var tmpl = 
    "<ul> \
        <%1 _.each(data, function(item){ %> \
            <li name=<%= item.name %>><%= item.name %></li> \
        <% }); %> \
        <li class='test'>end</li> \
    </ul>";

var mylist = function() {
    try {
        this.compiled = _.template(tmpl);
    } catch (error) {
        /* throw error; */
    }
    
}

mylist.prototype.mount = function(ele, data) {
    var _self = this;

    ele.innerHTML = this.compiled(data);
    
    this.test = ele.getElementsByClassName('test')[0];
    listen.add(this.test, 'click', function(e) {
        console.log('click test', _self);
        _self.removeEnd();
    })
}

mylist.prototype.removeEnd = function() {
    console.info('removeEnd: ', this.test);
    $(this.test).remove();
}

module.exports.mylist = mylist;