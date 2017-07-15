var data = [
    {name: 'tang'},
    {name: 'jia'},
    {name: 'wei'}
]

var compiled = _.template(
    "<ul> \
        <% _.each(data, function(item){ %> \
            <li><%= item.name %></li> \
        <% }); %> \
    </ul>"
);


document.getElementById('con').innerHTML = compiled(data);

